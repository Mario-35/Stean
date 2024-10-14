/**
 * HTML Views Core for API.
 *
 * @copyright 2020-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

import { koaContext } from "../../types";
import { addCssFile } from "../css";
export class CoreHtmlView {
    ctx: koaContext;
    _HTMLResult: string[];
    
    constructor(ctx: koaContext, datas?: string | string[]) {
      this.ctx = ctx;
      this._HTMLResult = datas ? typeof datas === 'string' ? [datas] : datas : [];
    }
    makeIdName(name: string): string {
      return `reg${name}`;
    }
    
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
      const idName = this.makeIdName(input.name);
      return `<div class="group"> 
                <input  id="${idName}"
                        name="${input.name}"
                        type="checkbox" 
                        class="check"${input.checked === true ? ' checked' : ''}> 
                <label for="${idName}"><span class="icon"></span>${input.label ? input.label : input.name}</label>
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
      const idName = this.makeIdName(input.name);
      return `<div class="group">
                <label  for="${idName}" class="label">
                 ${input.message}
                </label>
                <select class="select" id="${idName}" name="${input.name}">
                  ${this.multiSelectItem(input.list)}
                </select>
              </div>`;
    }
    addMultiSelect(input: { name: string, message: string, list: string[] }) {
      const idName = this.makeIdName(input.name);
      return `
                <div class="group selectBox" onclick="showCheckboxes(${idName})">
                <select>
                  <option >${input.message}</option>
                </select>
                <div class="overSelect"></div>
              </div>
              <div id="${idName}" class="checkboxes" checked="checked">
                ${this.multiSelectItemCheck(input.name, input.list)} 
            </div>`;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addTextInput(input: { name: string, label: string, value: any, alert?: string, toolType?: string, password?: boolean }) {
      const idName = this.makeIdName(input.name);
      return `<div class="group">
                <label  for="${idName}" class="label">${input.label} </label>
                ${ input.toolType ? `<div class='tooltip help'>
                        <span>?</span>
                        <div class='content'>
                          <b></b>
                          <p>${input.toolType}</p>
                        </div>
                      </div>` 
                      : ``
                }
                <input  id="${idName}" 
                        name="${input.name}" 
                        type="${input.password ? input.password == true ? 'password' : 'text' : 'text' }" 
                        class="input" 
                        value="${input.value}">
                        ${input.alert ? input.alert : ''}
              </div>`;
    }
    addHidden(name: string, value: string) {
      return`<input type="hidden" id="${name}" name="${name}" value="${value}" />`;
    }

    toArray() {
      return this._HTMLResult;
    }
    toString() {
      return this._HTMLResult.filter(e => e !== "").join("");
    }
  }
