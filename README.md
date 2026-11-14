# Kevin Lincoln — Nutricionista

Site institucional + página de vendas do nutricionista Kevin Lincoln (CRN 83678).
HTML/CSS/JS estático, publicado na Vercel. Sem build: cada página é um arquivo `.html` na raiz.

## Páginas

| Arquivo | Papel |
| --- | --- |
| `index.html` | Home / landing page: venda do Plano Trimestral + entrada pelo Desafio (R$ 97) |
| `metodo-atlas.html` | Página do Método Atlas e do Plano Trimestral (`#planos`) |
| `desafio-atlas-start.html` | Desafio Atlas Start — checkout direto na Kiwify |
| `sobre.html` | História, princípios e credenciais do Kevin |
| `resultados.html` | Depoimentos (com filtro) e trajetória |
| `duvidas.html` | Central de dúvidas com busca, categorias e link direto por pergunta |
| `contato.html` | Formulário completo + canais de contato |
| `acompanhamentos.html` | Comparativo Desafio x Método Atlas |
| `404.html` | Página de erro |

`historia.html`, `projeto-24-dias.html`, `metodo-atlas-start.html` e `acompanhamento-premium.html`
são URLs antigas: a Vercel faz redirect 301 (ver `vercel.json`) e os arquivos ficam como fallback.

## Estrutura

- `css/style.css` — design system (tokens no `:root`, componentes e responsividade no fim do arquivo).
- `js/main.js` — menu, modal, formulário (EmailJS + confirmação no WhatsApp), FAQ, filtros, CTA fixo no mobile.
- `img/site/` — imagens otimizadas usadas pelo site (WebP + JPG em várias larguras, favicons, OG image).
  As imagens originais em `img/` e `img/img_hist/` foram mantidas, mas não são mais carregadas pelo site.

## Como editar

- **Botão que abre o formulário:** qualquer elemento com `data-open-form="Plano Trimestral"`
  (ou `"Desafio Atlas Start"`) abre o modal já com o serviço selecionado.
- **Checkout do Desafio:** link da Kiwify `https://pay.kiwify.com.br/1g3I325`.
- **Nova foto:** gere versões `nome-480/800/1200.webp` (+ `.jpg`) em `img/site/` e use `<picture>`
  com `srcset`, `width`/`height` e `loading="lazy"` (só a foto do topo usa `fetchpriority="high"`).
- **SEO:** cada página tem title, description, canonical, Open Graph e JSON-LD (`@graph` com
  WebSite, MedicalBusiness, Person, WebPage, BreadcrumbList e, quando faz sentido, Service/Offer e FAQPage).
  Ao criar uma página nova, adicione-a ao `sitemap.xml`.
