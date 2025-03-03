  
/**
 * social panel
 *
 * @copyright 2023-present Inrae
 * @author mario.adam@inrae.fr
 *
 */

const floating_btn = document.querySelector('.floating-btn');
const close_btn = document.querySelector('.close-btn');
const social_panel_container = document.querySelector('.social-panel-container');

floating_btn.addEventListener('click', () => {
	social_panel_container.classList.toggle('visible')
});

close_btn.addEventListener('click', () => {
	social_panel_container.classList.remove('visible')
});

doc.onclick = () => {
	var temp = optHost.value.split("/");
	temp.pop();
	window.location.href = temp.join("/");
};

git.onclick = () => {
	window.location.href = "https://github.com/Mario-35/Stean";
};


email.onclick = () => {
	window.location.href = "mailto:mario.adam@inrae.fr";
};

discord.onclick = () => {
	window.location.href = "https://discord.gg/DYD2XQ6q";
};
