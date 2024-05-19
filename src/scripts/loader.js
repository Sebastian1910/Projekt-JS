document.onreadystatechange = function() {
    if (document.readyState !== "complete") {
        document.querySelector("body").style.visibility = "hidden";
        document.querySelector(".loader__div").style.visibility = "visible";
    } else {
        document.querySelector(".loader__div").style.display = "none";
        document.querySelector("body").style.visibility = "visible";
    }
};