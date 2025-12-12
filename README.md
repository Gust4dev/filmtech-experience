# Filmtech Experience

Landing Page oficial da Filmtech Academy, focada em cursos de PPF e gestão para estética automotiva de luxo.

## 🚀 Tecnologias

- **HTML5 Modular**: Arquitetura baseada em componentes injetáveis.
- **CSS3 Moderno**: Variáveis CSS, Flexbox, Grid e animações performáticas.
- **JavaScript Valina**: Lógica leve para interações e animações.
- **Vite**: Build tool para desenvolvimento rápido e otimização de assets.
- **Vite Plugin HTML Inject**: Para injeção de componentes HTML.

## 📂 Estrutura do Projeto

O projeto segue uma arquitetura modular para facilitar a manutenção:

```
/
├── public/              # Assets estáticos (imagens, fontes)
├── src/
│   ├── main.js          # Ponto de entrada JavaScript
│   ├── styles/          # Estilos globais
│   └── sections/        # Componentes HTML (Hero, Jornada, etc.)
├── index.html           # Arquivo raiz (injeção de módulos)
└── vite.config.js       # Configuração do Vite
```

## 🛠️ Como Executar

### Pré-requisitos
- Node.js instalado.

### Instalação
```bash
npm install
```

### Desenvolvimento
Para rodar o servidor local com Hot Module Replacement (HMR):
```bash
npm run dev
```

### Build (Produção)
Para gerar os arquivos otimizados na pasta `dist/`:
```bash
npm run build
```

---
Desenvolvido por Filmtech Academy.