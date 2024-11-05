/**
 * HTML Views Core for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { log } from "../../log";
import { koaContext } from "../../types";
import { addCssFile } from "../css";

export class CoreHtmlView {
    ctx: koaContext;
    _HTMLResult: string[];
    
    constructor(ctx: koaContext, datas?: string | string[]) {
      console.log(log.whereIam("View"));
      this.ctx = ctx;
      this._HTMLResult = datas ? typeof datas === 'string' ? [datas] : datas : [];
    }

    // makeIdName(name: string): string {
    //   return `reg${name}`;
    // }
    
    title(message: string): string {
      return `<div class="title">${message}</div>`;
    }    
    
    hr(): string {
      return '<div class="hr"></div>';
    }

    head (title: string, css?: string | string[]): string {
      return `<head>
                <meta charset="utf-8">
                <style>${addCssFile(css || ["userForm.css", "message.css"])}</style>
                <title>${title}</title>
              </head>`;
    };
    
    foot( links: { href: string; class: string; name: string; }[] ): string  {
      const returnValue: string[] = [this.hr()];
      links.forEach((element: { href: string; class: string; name: string }) => {
          returnValue.push(`
          <div class="inner">
            <a  href="${element.href}" 
                class="${element.class}">${element.name}</a>
          </div>`);
      });
      return returnValue.join();
    };
    
    addSubmitButton(label: string, ) {
      return `<div class="group">
                <input type="submit" class="button" value="${label}">
              </div>`;
    }
    AddErrorMessage(error: string ) {
      return error === "undefined" ? '' : `<div class="message-container">
        <div class="error">
                ${error}
        </div>
      </div>`;
    }
    addButton(action: string, label: string ) {
      return `<div class="group">
                <a href="${action}" class="button" >${label}</a>
              </div>`;
    }
    addCheckBox(input: { name: string, checked: boolean, label?: string }) {
      // const idName = this.makeIdName(input.name);
      return `<div class="group"> 
                <input  id="${input.name}"
                        name="${input.name}"
                        type="checkbox" 
                        class="check"${input.checked === true ? ' checked' : ''}> 
                <label for="${input.name}"><span class="icon"></span>${input.label ? input.label : input.name}</label>
              </div>`;
    }
    multiSelectItemCheck(name: string, list: string[]): string {
      const res: string[] = [];
      list.forEach((e: string) => {
        res.push(`<label for="${e}"> <input type="checkbox" id="${name}${e}" name="${name}${e}" />${e}</label>`)});
      return res.join("");
    }
    multiSelectItem(list: string[]): string {
      const res: string[] = [];
      list.forEach((e: string, n: number) => {
        res.push(`<option value="${e}">${e}</option>`)});
      return res.join("");
    }
    addSelect(input: { name: string, message: string, list: string[] , value: any, alert?: string, toolType?: string, password?: boolean }) {
      // const idName = this.makeIdName(input.name);
      return `<div class="group">
                <label  for="${input.name}" class="label">
                 ${input.message}
                </label>
                <select class="select" id="${input.name}" name="${input.name}">
                  ${this.multiSelectItem(input.list)}
                </select>
              </div>`;
    }
    addMultiSelect(input: { name: string, message: string, list: string[], values: string[] }) {
      // const idName = this.makeIdName(input.name);
      const res = input.list.map((e: string, n: number) => `<option value="${e}">${e}</option>`);

      return `<div class="group">
                <label  for="${input.name}" class="label">Select ${input.name}</label>
                <select id="${input.name}" name="${input.name}" multiple onchange="${input.name}.value = Array.from(this.selectedOptions).map(x=>x.value??x.text)"> ${res} </select>
                </div>`;

    }    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addTextInput(input: { 
      name: string, 
      label: string, 
      value: string, 
      alert?: string, 
      toolType?: string, 
      password?: boolean, 
      disabled?: boolean 
      onlyAlpha?: boolean 
    }) {      
      // const idName = this.makeIdName(input.name);
      return `<div class="group">
                <label  for="${input.name}" class="label">${input.label} </label>
                ${ input.toolType ? `<div class='tooltip help'>
                        <span>?</span>
                        <div class='content'>
                          <b></b>
                          <p>${input.toolType}</p>
                        </div>
                      </div>` 
                      : ``
                }
                <input  id="${input.name}" 
                        name="${input.name}" 
                        type="${input.password ? input.password == true ? 'password' : 'text' : 'text' }" 
                        class="input" 
                        ${input.disabled ? 'disabled' : ''}
                        ${input.onlyAlpha ? `onkeypress="clsAlphaNoOnly(event)"` : ''}
                        value="${input.value}">
                        ${input.alert ? input.alert : ''}
              </div>`;
    }
    addHidden(name: string, datas: string | any) {
      return (typeof datas === "string")
          ? `<input type="hidden" id="${name}" name="${name}" value="${datas}" />`
          : `<input type="hidden" id="${name}" name="${name}" value="${datas.body[name] || ""}" />`;
    }

    toArray() {
      return this._HTMLResult;
    }
    toString() {
      return this._HTMLResult.filter(e => e !== "").join("");
    }


    addMultiJs() {
      return `var style=document.createElement("style");function MultiselectDropdown(e,t){var l=document.getElementById(e);function s(e,t){var l=document.createElement(e);return void 0!==t&&Object.keys(t).forEach((e=>{"class"===e?Array.isArray(t[e])?t[e].forEach((e=>""!==e?l.classList.add(e):0)):""!==t[e]&&l.classList.add(t[e]):"style"===e?Object.keys(t[e]).forEach((s=>{l.style[s]=t[e][s]})):"text"===e?""===t[e]?l.innerHTML="&nbsp;":l.innerText=t[e]:l[e]=t[e]})),l}var c=s("div",{class:"multiselect-dropdown"});c.id="multiselect-"+l.id,l.style.display="none",l.parentNode.insertBefore(c,l.nextSibling);var d=s("div",{class:"multiselect-dropdown-list-wrapper"}),i=s("div",{class:"multiselect-dropdown-list",style:{height:"15rem"}});c.appendChild(d),d.appendChild(i),l.loadOptions=()=>{i.innerHTML="",Array.from(l.options).map((e=>{e.selected=t.split(",").includes(e.value);var c=s("div",{class:e.selected?"checked":"",optEl:e}),d=s("input",{type:"checkbox",checked:e.selected});c.appendChild(d),c.appendChild(s("label",{text:e.text})),c.addEventListener("click",(()=>{c.classList.toggle("checked"),c.querySelector("input").checked=!c.querySelector("input").checked,c.optEl.selected=!c.optEl.selected,l.dispatchEvent(new Event("change"))})),d.addEventListener("click",(e=>{d.checked=!d.checked})),e.listitemEl=c,i.appendChild(c)})),c.listEl=d,c.refresh=()=>{c.querySelectorAll("span.optext, span.placeholder").forEach((e=>c.removeChild(e)));var e=Array.from(l.selectedOptions);e.length>(l.attributes["multiselect-max-items"]?.value??5)?c.appendChild(s("span",{class:["optext","maxselected"],text:e.length+" "+l.name})):e.map((e=>{var t=s("span",{class:"optext",text:e.text,srcOption:e});"true"!==l.attributes["multiselect-hide-x"]?.value&&t.appendChild(s("span",{class:"optdel",text:"🗙",onclick:e=>{t.srcOption.listitemEl.dispatchEvent(new Event("click")),c.refresh(),e.stopPropagation()}})),c.appendChild(t)})),0==l.selectedOptions.length&&c.appendChild(s("span",{class:"placeholder",text:l.attributes.placeholder?.value??l.placeholder}))},c.refresh()},l.loadOptions(),c.addEventListener("click",(()=>{c.listEl.style.display="block"})),document.addEventListener("click",(function(e){c.contains(e.target)||(d.style.display="none",c.refresh())}))}style.setAttribute("id","multiselect_dropdown_styles");`
    }

  }
