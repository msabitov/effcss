import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div data-fc="dir-c" data-ind="py-xl px-3xl">
    <div data-fc data-sz="w-1/4" data-ind="mx-a">
      <a href="https://vite.dev" target="_blank" data-gc="jc-c" data-fi="fg-1">
        <img src="${viteLogo}" class="logo" alt="Vite logo" data-ind="mr-0"/>
      </a>
      <a href="https://www.typescriptlang.org/" target="_blank" data-gc="jc-c" data-fi="fg-1">
        <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
      </a>
    </div>
    <h1 data-ind="mx-a" data-tx="ta-c" data-b="bw-m ch-i cc-m cl-m ca-m">Vite + TypeScript</h1>
    <div data-fc="jc-c ai-c" data-ind="py-m">
      <button id="counter" type="button" data-sz="w-m h-xs" data-c="b bl-s" data-b="r-m">Button</button>
    </div>
    <p data-ind="mx-a my-m p-s" data-bx="shp-f shs-s" data-b="r-s">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
