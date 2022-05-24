const changeImage = () => {
    const bulbImage = document.getElementById('bulbImage');
    if (bulbImage.src.match("bulbon")) {
        bulbImage.src = "images/bulboff.gif";
    } else {
        bulbImage.src = "images/bulbon.gif";
    }
}