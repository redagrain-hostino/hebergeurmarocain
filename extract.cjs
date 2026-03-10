const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'src/pages/index.astro');
let content = fs.readFileSync(indexPath, 'utf8');

// Function to extract text between two strings
function extractBetween(str, start, end, includeStart = false, includeEnd = false) {
    const startIndex = str.indexOf(start);
    if (startIndex === -1) return null;
    
    let endIndex;
    if (end) {
        endIndex = str.indexOf(end, startIndex + start.length);
        if (endIndex === -1) return null;
    } else {
        endIndex = str.length;
    }

    const startPos = includeStart ? startIndex : startIndex + start.length;
    const endPos = includeEnd ? endIndex + end.length : endIndex;

    return str.substring(startPos, endPos);
}

// 1. Hero Section
const heroHtml = extractBetween(content, '<section class="hero-section">', '<!-- ════════════════', true, false).trim();
const heroCss = extractBetween(content, '.hero-section {', '/* ─────────────────────────────────────────────────────────────\r\n       COMPARATIF SECTION', true, false).trim();

// 2. Compare Section
const compareHtml = extractBetween(content, '<section class="compare-section">', '<!-- How to Choose Section -->', true, false).trim();
const compareCss = extractBetween(content, '.compare-section {', '/* How To Choose Section */', true, false).trim();

// 3. Choose Section
const chooseHtml = extractBetween(content, '<section class="choose-section">', '<!-- Préambule / Why Choose Section -->', true, false).trim();
const chooseCss = extractBetween(content, '.choose-section {', '.preamble-shape {', true, false).trim();

// 4. Preamble Section
const preambleHtml = extractBetween(content, '<section class="preamble-section">', '<!-- Comparateur Article Section -->', true, false).trim();
const preambleCss = extractBetween(content, '.preamble-shape {', '/* ─────────────────────────────────────────────────────────────\r\n       COMPARATEUR ARTICLE SECTION', true, false).trim();

// 5. Comparateur Article Section
const comparateurHtml = extractBetween(content, '<section class="comparateur-section">', '<!-- Blog Section -->', true, false).trim();
const comparateurCss = extractBetween(content, '.comparateur-section {', '/* ─────────────────────────────────────────────────────────────\r\n       BLOG SECTION', true, false).trim();

// 6. Blog Section
const blogHtml = extractBetween(content, '<section class="blog-section">', '</Layout>', true, false).trim();
const blogCss = extractBetween(content, '/* ─────────────────────────────────────────────────────────────\r\n       BLOG SECTION\r\n    ───────────────────────────────────────────────────────────── */', '</style>', true, false).trim();

// Function to write a component
function writeComponent(name, html, css) {
    const componentContent = `---
---
${html}

<style>
${css}
</style>
`;
    fs.writeFileSync(path.join(__dirname, 'src/components', name), componentContent, 'utf8');
}

writeComponent('HeroSection.astro', heroHtml, heroCss);
writeComponent('CompareSection.astro', compareHtml, compareCss);
writeComponent('ChooseSection.astro', chooseHtml, chooseCss);
writeComponent('PreambleSection.astro', preambleHtml, preambleCss);
writeComponent('ComparateurArticleSection.astro', comparateurHtml, comparateurCss);
// Fix blog CSS extraction (strip the section comment if we grabbed it)
const cleanBlogCss = typeof blogCss === 'string' ? blogCss.replace('/* ─────────────────────────────────────────────────────────────\r\n       BLOG SECTION\r\n    ───────────────────────────────────────────────────────────── */', '').trim() : '';
writeComponent('BlogSection.astro', blogHtml, extractBetween(content, '.blog-section {', '</style>', true, false).trim());

// Now update index.astro
const imports = `import Layout from "../layouts/Layout.astro";
import HeroSection from "../components/HeroSection.astro";
import CompareSection from "../components/CompareSection.astro";
import ChooseSection from "../components/ChooseSection.astro";
import PreambleSection from "../components/PreambleSection.astro";
import ComparateurArticleSection from "../components/ComparateurArticleSection.astro";
import BlogSection from "../components/BlogSection.astro";`;

const newIndexContent = `---
${imports}
---

<Layout title="Hébergeur Marocain - Meilleur hébergement web au Maroc">
	<main>
		<HeroSection />
	</main>

	<!-- ═══════════════════════════════════════════════════
             COMPARATIF SECTION
        ═══════════════════════════════════════════════════ -->
	<CompareSection />
	
	<!-- How to Choose Section -->
	<ChooseSection />
	
	<!-- Préambule / Why Choose Section -->
	<PreambleSection />
	
	<!-- Comparateur Article Section -->
	<ComparateurArticleSection />
	
	<!-- Blog Section -->
	<BlogSection />
</Layout>
`;

fs.writeFileSync(indexPath, newIndexContent, 'utf8');
console.log('Successfully extracted components and updated index.astro!');
