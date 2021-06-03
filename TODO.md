create about page

trendy page
popular page
random page

created page
my palettes page { created +fav }

# tags to be checked if size is not too big

or may be change text input to mutiple option select input
also make tag hover effect

error handling

admin app/page

useHistory in detailedpalette crash

date-fns check for better format

userID randomization

    const copyToClipBoard = (e) => {
    	e.preventDefault();
    	//to copy HEXcode on clipboard by clicking this
    	let temp = document.createElement("input");
    	document.body.appendChild(temp);
    	temp.value = e.target.innerText;
    	temp.select();
    	document.execCommand("copy");
    	temp.remove();

    	//tooltip
    	let tip = document.createElement("div");
    	tip.innerHTML = "<p>Copied!</p>";
    	tip.classList.add("btn");
    	tip.classList.add("tip");
    	tip.setAttribute(
    		"style",
    		`transform:translate(${e.pageX - 25}px,${e.pageY + 10}px)`
    	);
    	document.body.prepend(tip);
    	// setTimeout(() => {
    	// 	if (document.body.firstChild.classList.contains("tip")) {
    	// 		document.body.firstChild.remove();
    	// 	}
    	// }, 100);
    };
