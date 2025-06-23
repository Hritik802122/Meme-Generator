// --- DOM Elements ---
const generateMemeBtn = document.querySelector(".generate-meme-btn");
const memeImage = document.querySelector(".meme-generator-card .meme-image");
const memeTitle = document.querySelector(".meme-generator-card .meme-title");
const memeAuthor = document.querySelector(".meme-generator-card .meme-author");
const categorySelect = document.querySelector("#category");
const themeToggleBtn = document.getElementById("theme-toggle");
const downloadMemeBtn = document.querySelector(".download-meme-btn");
const loader = document.querySelector(".loader");

// --- Functions ---

const updateDetails = (url, title, author) => {
  memeImage.setAttribute("src", url);
  memeImage.onload = () => {
   
    loader.classList.remove("show");
    memeImage.classList.add("loaded");
    memeTitle.innerHTML = title;
    memeAuthor.innerHTML = `Meme by: ${author}`;
  };
};


const generateMeme = async () => {
  // Show loader and hide old meme
  loader.classList.add("show");
  memeImage.classList.remove("loaded");
  memeTitle.innerHTML = "";
  memeAuthor.innerHTML = "";

  try {
    const category = categorySelect.value;
    const response = await fetch(`https://meme-api.com/gimme/${category}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    updateDetails(data.url, data.title, data.author);
  } catch (error) {
    console.error("Error fetching meme:", error);
    memeTitle.innerHTML = "Oops! Could not fetch a meme.";
    memeAuthor.innerHTML = "Please try again later.";
    loader.classList.remove("show");
  }
};


const downloadMeme = async () => {
    
    if (!memeImage.src || memeImage.src.includes('placeholder')) {
        alert("Generate a meme first before downloading!");
        return;
    }
    try {
        // Fetch the image data
        const response = await fetch(memeImage.src);
        const blob = await response.blob();
        
     
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        a.download = memeTitle.textContent.replace(/\s+/g, '_') + '.jpg' || 'meme.jpg';
        document.body.appendChild(a);
        a.click();
        
    
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Error downloading meme:", error);
        alert("Failed to download the meme. Please try again.");
    }
};



const applyTheme = (theme) => {
  const isDarkMode = theme === "dark";
  document.body.classList.toggle("dark-mode", isDarkMode);
  
  const themeIcon = themeToggleBtn.querySelector("i");
  const themeText = themeToggleBtn.querySelector("span");

  themeIcon.className = isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon";
  themeText.textContent = isDarkMode ? "Light Mode" : "Dark Mode";
};

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
});



generateMemeBtn.addEventListener("click", generateMeme);
downloadMemeBtn.addEventListener("click", downloadMeme);
categorySelect.addEventListener("change", generateMeme);



document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
  generateMeme();
});