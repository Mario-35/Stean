/**
 * @module index
 * (Base script)
 */

/**
 * @module _type
 */

/**
 * Languages supported
 * @typedef {('asm'|'bash'|'bf'|'c'|'css'|'csv'|'diff'|'docker'|'git'|'go'|'html'|'http'|'ini'|'java'|'js'|'jsdoc'|'json'|'leanpub-md'|'log'|'lua'|'make'|'md'|'pl'|'plain'|'py'|'regex'|'rs'|'sql'|'todo'|'toml'|'ts'|'uri'|'xml'|'yaml')} ShjLanguage
 */

/**
 * Themes supported in the browser
 * @typedef {('atom-dark'|'github-dark'|'github-dim'|'dark'|'default'|'github-light'|'visual-studio-dark')} ShjBrowserTheme
 */

/**
 * Languages supported
 * @typedef {('default'|'atom-dark')} ShjTerminalTheme
 */

/**
 * @typedef {('inline'|'oneline'|'multiline')} ShjDisplayMode
 * * `inline` inside `code` element
 * * `oneline` inside `div` element and containing only one line
 * * `multiline` inside `div` element
 */

/**
 * @typedef {('deleted'|'err'|'var'|'section'|'kwd'|'class'|'cmnt'|'insert'|'type'|'func'|'bool'|'num'|'oper'|'str'|'esc')} ShjToken
 */

/**
 * @typedef {Object} ShjOptions
 * @property {Boolean} [hideLineNumbers=false] Indicates whether to hide line numbers
 */

const expandData = {
	num: {
		type: 'num',
		match: /(\.e?|\b)\d(e-|[\d.oxa-fA-F_])*(\.|\b)/g
	},
	str: {
		type: 'str',
		match: /(["'])(\\[^]|(?!\1)[^\r\n\\])*\1?/g
	},
	strDouble: {
		type: 'str',
		match: /"((?!")[^\r\n\\]|\\[^])*"?/g
	}
};

const langs = {},
	sanitize = (str = '') =>
	str.replaceAll('&', '&#38;').replaceAll?.('<', '&lt;').replaceAll?.('>', '&gt;'),
	/**
	 * @function
	 * @ignore
	 * Create a HTML element with the right token styling
	 * @param {String} str The content (need to be sanitized)
	 * @param {ShjToken} [token] The type of token
	 * @returns A HMTL string
	 */
	toSpan = (str, token) => token ? `<span class="shj-syn-${token}">${str}</span>` : str;

/**
 * @function tokenize
 * Find the tokens in the given code and call the callback
 * @param {String} src The code
 * @param {ShjLanguage|Array} lang The language of the code
 * @param {function(String, ShjToken=):void} token The callback function
 * this function will be given
 * * the text of the token
 * * the type of the token
 */
function tokenize(src, lang, token) {
	try {
		let m;
		let part;
		let first = {};
		let match;
		let cache = [];
		let i = 0;
		let data = typeof lang === 'string' ? ((langs[lang] ??= highLightLangs[lang])) : lang;
		// make a fast shallow copy to bee able to splice lang without change the original on
		let arr = [...typeof lang === 'string' ? data : data.sub];
		// arr = [...typeof lang === 'string' ? data.default : lang.sub];
		while (i < src.length) {
			first.index = null;
			for (m = arr.length; m-- > 0;) {
				part = arr[m].expand ? expandData[arr[m].expand] : arr[m];
				// do not call again exec if the previous result is sufficient
				if (cache[m] === undefined || cache[m].match.index < i) {
					part.match.lastIndex = i;
					match = part.match.exec(src);
					if (match === null) {
						// no more match with this regex can be disposed
						arr.splice(m, 1);
						cache.splice(m, 1);
						continue;
					}
					// save match for later use to decrease performance cost
					cache[m] = {
						match,
						lastIndex: part.match.lastIndex
					};
				}
				// check if it the first match in the string
				if (cache[m].match[0] && (cache[m].match.index <= first.index || first.index === null))
					first = {
						part: part,
						index: cache[m].match.index,
						match: cache[m].match[0],
						end: cache[m].lastIndex
					};
			}
			if (first.index === null)
				break;
			token(src.slice(i, first.index), data.type);
			i = first.end;
			if (first.part.sub)
				tokenize(first.match, typeof first.part.sub === 'string' ? first.part.sub : (typeof first.part.sub === 'function' ? first.part.sub(first.match) : first.part), token);
			else
				token(first.match, first.part.type);
		}
		token(src.slice(i, src.length), data.type);
	} catch (err) {
		token(src);
	}
}

/**
 * @function highlightText
 * @async
 * Highlight a string passed as argument and return it
 * @example
 * elm.innerHTML = await highlightText(code, 'js');
 * @param {String} src The code
 * @param {ShjLanguage} lang The language of the code
 * @param {Boolean} [multiline=true] If it is multiline, it will add a wrapper for the line numbering and header
 * @param {ShjOptions} [opt={}] Customization options
 * @returns {Promise<String>} The highlighted string
 */
function highlightText(src, lang, opt = {}) {
	let tmp = '';
	tokenize(src, lang, (str, type) => tmp += toSpan(sanitize(str), type));

	return tmp;
	// return multiline
	// 	? `<div><div class="shj-numbers">${'<div></div>'.repeat(!opt.hideLineNumbers && src.split('\n').length)}</div><div>${tmp}</div></div>`
	// 	: tmp;
}

/**
 * @function highlightElement
 * @async
 * Highlight a DOM element by getting the new innerHTML with highlightText
 * @param {Element} elm The DOM element
 * @param {ShjLanguage} [lang] The language of the code (seaching by default on `elm` for a 'shj-lang-' class)
 * @param {ShjDisplayMode} [mode] The display mode (guessed by default)
 * @param {ShjOptions} [opt={}] Customization options
 */
function highlightElement(elm, src, lang, opt) {
	let txt = src || elm.textContent;
	elm.dataset.lang = lang;
	elm.className = `${[...elm.classList].filter(className => !className.startsWith('shj-') || className.startsWith('shj-mode-')).join(' ')} shj-lang-${lang} shj-multiline`;
	elm.innerHTML = highlightText(txt, lang, opt);
}