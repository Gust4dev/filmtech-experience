/**
 * Filmtech - Image Optimizer & Converter
 * Converte todas as imagens para WebP e otimiza para web
 * 
 * USO: node optimize-images.js
 * 
 * Requer: npm install sharp heic-convert
 */

const fs = require('fs').promises;
const path = require('path');

// Tentar importar dependências
let sharp, heicConvert;

async function checkDependencies() {
    try {
        sharp = require('sharp');
    } catch (e) {
        console.error('❌ Dependência "sharp" não encontrada.');
        console.log('   Execute: npm install sharp');
        process.exit(1);
    }
    
    try {
        heicConvert = require('heic-convert');
    } catch (e) {
        console.error('❌ Dependência "heic-convert" não encontrada.');
        console.log('   Execute: npm install heic-convert');
        process.exit(1);
    }
}

const CONFIG = {
    inputDir: './public',
    outputDir: './public/optimized',
    // Extensões suportadas
    supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic', '.heif'],
    // Configuração de saída
    output: {
        format: 'webp',
        quality: 85,
        // Tamanho máximo (redimensiona se maior)
        maxWidth: 1920,
        maxHeight: 1080
    }
};

async function ensureOutputDir() {
    try {
        await fs.mkdir(CONFIG.outputDir, { recursive: true });
        console.log(`📁 Diretório de saída: ${CONFIG.outputDir}`);
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }
}

async function getImageFiles() {
    const files = await fs.readdir(CONFIG.inputDir);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return CONFIG.supportedExtensions.includes(ext);
    });
}

async function convertHeicToBuffer(inputPath) {
    const inputBuffer = await fs.readFile(inputPath);
    const outputBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'PNG',
        quality: 1
    });
    return outputBuffer;
}

async function optimizeImage(filename) {
    const inputPath = path.join(CONFIG.inputDir, filename);
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);
    const outputFilename = `${baseName}.${CONFIG.output.format}`;
    const outputPath = path.join(CONFIG.outputDir, outputFilename);
    
    console.log(`\n🔄 Processando: ${filename}`);
    
    try {
        let imageBuffer;
        
        // Se for HEIC, converter primeiro
        if (ext === '.heic' || ext === '.heif') {
            console.log('   📱 Convertendo de HEIC...');
            imageBuffer = await convertHeicToBuffer(inputPath);
        } else {
            imageBuffer = await fs.readFile(inputPath);
        }
        
        // Processar com Sharp
        let pipeline = sharp(imageBuffer);
        
        // Obter metadados
        const metadata = await pipeline.metadata();
        console.log(`   📐 Original: ${metadata.width}x${metadata.height}`);
        
        // Redimensionar se necessário
        if (metadata.width > CONFIG.output.maxWidth || metadata.height > CONFIG.output.maxHeight) {
            pipeline = pipeline.resize(CONFIG.output.maxWidth, CONFIG.output.maxHeight, {
                fit: 'inside',
                withoutEnlargement: true
            });
            console.log(`   ↔️  Redimensionando para max ${CONFIG.output.maxWidth}x${CONFIG.output.maxHeight}`);
        }
        
        // Converter para WebP
        pipeline = pipeline.webp({ quality: CONFIG.output.quality });
        
        // Salvar
        await pipeline.toFile(outputPath);
        
        // Stats
        const inputStats = await fs.stat(inputPath);
        const outputStats = await fs.stat(outputPath);
        const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
        
        console.log(`   ✅ Salvo: ${outputFilename}`);
        console.log(`   📉 Tamanho: ${formatBytes(inputStats.size)} → ${formatBytes(outputStats.size)} (${savings}% menor)`);
        
        return { success: true, filename: outputFilename };
        
    } catch (err) {
        console.error(`   ❌ Erro: ${err.message}`);
        return { success: false, error: err.message };
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
    console.log('═══════════════════════════════════════════');
    console.log('  🖼️  FILMTECH IMAGE OPTIMIZER');
    console.log('═══════════════════════════════════════════\n');
    
    await checkDependencies();
    await ensureOutputDir();
    
    const imageFiles = await getImageFiles();
    
    if (imageFiles.length === 0) {
        console.log('⚠️  Nenhuma imagem encontrada em', CONFIG.inputDir);
        return;
    }
    
    console.log(`\n📷 Encontradas ${imageFiles.length} imagens para processar:`);
    imageFiles.forEach(f => console.log(`   - ${f}`));
    
    const results = {
        success: [],
        failed: []
    };
    
    for (const file of imageFiles) {
        const result = await optimizeImage(file);
        if (result.success) {
            results.success.push(result.filename);
        } else {
            results.failed.push({ file, error: result.error });
        }
    }
    
    // Resumo
    console.log('\n═══════════════════════════════════════════');
    console.log('  📊 RESUMO');
    console.log('═══════════════════════════════════════════');
    console.log(`\n✅ Sucesso: ${results.success.length}`);
    results.success.forEach(f => console.log(`   - ${f}`));
    
    if (results.failed.length > 0) {
        console.log(`\n❌ Falhas: ${results.failed.length}`);
        results.failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
    }
    
    console.log(`\n📁 Imagens otimizadas salvas em: ${CONFIG.outputDir}`);
    console.log('\n💡 Atualize o HTML para usar as imagens de public/optimized/');
}

main().catch(console.error);
