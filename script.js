const myLibrary = [];
const addButton = document.querySelector(".add-book");
//Dialog:
const newBookDialog = document.getElementById("addBookDialog");
const confirmButton = newBookDialog.querySelector("#confirmBtn");
const cancelButton = newBookDialog.querySelector("#cancelBtn");
const cardsParent = document.querySelector(".book-cards");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const numberOfPagesInput = document.getElementById("numberOfPages");
const haveReadCheckbox = document.getElementById("haveRead");

addBookToLibrary(new Book("The Hobbit", "J.R.R. Tolkien", 295, true));
addBookToLibrary(new Book("Dune", "Some Genius", 317, true));
addBookToLibrary(new Book("50 Shades of Gray", "Some Idiot", 69, false));
generateBookCards();

addButton.addEventListener("click", () => {
    newBookDialog.showModal();
    haveReadCheckbox.checked = false;
    titleInput.value = "";
    authorInput.value = "";
    numberOfPagesInput.value = "";
});

cardsParent.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-book")) {
        removeBookFromLibrary(event.target.getAttribute("data-index"));
        ClearBookCards();
        generateBookCards();
    }
});

confirmButton.addEventListener("click", (event) => {
    if (titleInput.value != "" && authorInput.value != "" && numberOfPagesInput.value != "") {
        const newBook = new Book(titleInput.value, authorInput.value, numberOfPagesInput.value, haveReadCheckbox.checked);
        event.preventDefault(); // We don't want to submit this fake form
        newBookDialog.close(JSON.stringify(newBook));
    }
});

cancelButton.addEventListener("click", (event) => {
    event.preventDefault(); // We don't want to submit this fake form
    newBookDialog.close("cancel");
});

newBookDialog.addEventListener("close", (e) => {
    if (newBookDialog.returnValue != "cancel") {
        const returnedBook = JSON.parse(newBookDialog.returnValue);
        addBookToLibrary(returnedBook);
        ClearBookCards();
        generateBookCards();
    }
});



function ClearBookCards() {
    const cards = document.querySelectorAll(".book-card");
    cards.forEach(card => {
        card.remove();
    })
}

function Book(title, author, numberOfPages, haveRead) {
    this.title = title,
        this.author = author,
        this.numberOfPages = numberOfPages,
        this.haveRead = haveRead;
    this.info = function () {
        let readStatus = this.haveRead ? "read already" : "not read yet";
        return `${this.title} by ${this.author}, ${this.numberOfPages} pages, ${readStatus}.`;
    }
}

Book.prototype.markAsRead = function () {
    this.haveRead = true;
}

function removeBookFromLibrary(bookIndex) {
    if (bookIndex > -1) {
        myLibrary.splice(bookIndex, 1);
    }
}

function addBookToLibrary(book) {
    myLibrary.push(book);
}

function generateBookCards() {
    myLibrary.forEach(book => {
        addNewBookCard(book.title, book.author, book.numberOfPages, book.haveRead, myLibrary.indexOf(book));
    })
}

function addNewBookCard(title, author, pages, haveRead, index) {
    // Create a new div element with the "book-card" class
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";

    // Create an h3 element for the title
    const titleElement = document.createElement("h3");
    titleElement.textContent = title;

    // Create a p element for the author
    const authorElement = document.createElement("p");
    authorElement.textContent = author;

    // Create a p element for the number of pages
    const pagesElement = document.createElement("p");
    pagesElement.textContent = `Pages: ${pages}`;

    // Create a div element for the read checkbox
    const readDiv = document.createElement("div");

    // Create a label element for the checkbox
    const readLabel = document.createElement("label");
    readLabel.setAttribute("for", "haveRead");
    readLabel.textContent = "Read";

    // Create the input element (checkbox)
    const readInput = document.createElement("input");
    readInput.setAttribute("type", "checkbox");
    readInput.setAttribute("name", "haveRead");
    readInput.setAttribute("id", "haveRead");
    readInput.checked = haveRead; // Set the checkbox's checked state
    readInput.disabled = true;

    // Create button for removing book from library
    const removeButton = document.createElement("button");
    removeButton.className = "remove-book";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("data-index", index);

    // Append the elements to the bookCard
    bookCard.appendChild(titleElement);
    bookCard.appendChild(authorElement);
    bookCard.appendChild(pagesElement);
    readDiv.appendChild(readLabel);
    readDiv.appendChild(readInput);
    bookCard.appendChild(readDiv);
    bookCard.appendChild(removeButton);

    // Append the bookCard to the .book-cards container
    const bookContainer = document.querySelector(".book-cards");
    bookContainer.appendChild(bookCard);
}
