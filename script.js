//TODO: add event driver logic

class Dialog {
    constructor(library) {
        this.#library = library;
        this.#show();
        this.#startListeners();
    }

    #library;

    //HTML elements
    #newBookDialog = document.getElementById("addBookDialog");
    #cancelButton = document.querySelector("#cancelBtn");
    #titleInput = document.getElementById("title");
    #authorInput = document.getElementById("author");
    #numberOfPagesInput = document.getElementById("numberOfPages");
    #haveReadCheckbox = document.getElementById("haveRead");
    #confirmButton = this.#newBookDialog.querySelector("#confirmBtn");

    #show = () => {
        this.#newBookDialog.showModal();
    }

    #resetValues = () => {
        this.#haveReadCheckbox.checked = false;
        this.#titleInput.value = "";
        this.#authorInput.value = "";
        this.#numberOfPagesInput.value = "";
    }

    #startListeners = () => {
        this.#confirmButton.addEventListener("click", this.#handleConfirmClick);
        this.#newBookDialog.addEventListener("close", this.#handleDialogClose);
        this.#cancelButton.addEventListener("click", this.#handleCancelClick);
    }

    // Remove event listeners and reset values
    #dispose = () => {
        this.#resetValues();
        this.#confirmButton.removeEventListener("click", this.#handleConfirmClick);
        this.#newBookDialog.removeEventListener("close", this.#handleDialogClose);
        this.#cancelButton.removeEventListener("click", this.#handleCancelClick);
        this.#newBookDialog = null;
        this.#cancelButton = null;
        this.#titleInput = null;
        this.#authorInput = null;
        this.#numberOfPagesInput = null;
        this.#haveReadCheckbox = null;
        this.#confirmButton = null;
    }

    // Event listener methods (using arrow functions to preserve 'this' context)
    #handleConfirmClick = (event) => {
        if (this.#titleInput.value != "" && this.#authorInput.value != "" && this.#numberOfPagesInput.value != "") {
            const newBook = new Book(this.#titleInput.value, this.#authorInput.value, this.#numberOfPagesInput.value, this.#haveReadCheckbox.checked);
            event.preventDefault(); // We don't want to submit this fake form
            this.#newBookDialog.close(JSON.stringify(newBook));
        }
    }

    #handleDialogClose = (e) => {
        if (this.#newBookDialog.returnValue != "cancel") {
            const returnedBook = JSON.parse(this.#newBookDialog.returnValue);
            this.#dispose();
            this.#library.addBookToLibrary(returnedBook);
            // FIXME: Send event instead of using global functions inside a class
            DisplayHandler.clearBookCards();
            DisplayHandler.generateBookCards();
        }
    }

    #handleCancelClick = (event) => {
        event.preventDefault(); // We don't want to submit this fake form
        this.#newBookDialog.close("cancel");
        this.#dispose();
    }
}

class Book {
    constructor(title, author, numberOfPages, haveRead) {
        this.title = title;
        this.author = author;
        this.numberOfPages = numberOfPages;
        this.haveRead = haveRead;
    }

    markAsRead = () => {
        this.haveRead = true;
    }
}

class Library {
    static #books = [];

    static get books() {
        return this.#books;
    }

    static removeBookFromLibrary(bookIndex) {
        if (bookIndex > -1) {
            this.#books.splice(bookIndex, 1);
        }
    }

    static addBookToLibrary(book) {
        this.#books.push(book);
    }
}

class DisplayHandler {
    static #addButton = document.querySelector(".add-book");
    static #cardsParent = document.querySelector(".book-cards");
    static #library;

    static init = (library) => {
        this.#library = library;
        this.generateBookCards();
        this.#addButton.addEventListener("click", () => {
            new Dialog(this.#library);
        });
        
        this.#cardsParent.addEventListener("click", (event) => {
            if (event.target.classList.contains("remove-book")) {
                //FIXME: add event instead of external reference to Library
                this.#library.removeBookFromLibrary(event.target.getAttribute("data-index"));
                this.clearBookCards();
                this.generateBookCards();
            }
        });
    }

    static clearBookCards() {
        const cards = document.querySelectorAll(".book-card");
        cards.forEach(card => {
            card.remove();
        })
    }

    static generateBookCards() {
        //FIXME: add event instead of external reference to Library
        this.#library.books.forEach(book => {
            this.#addNewBookCard(book.title, book.author, book.numberOfPages, book.haveRead, Library.books.indexOf(book));
        })
    }
    
    static #addNewBookCard(title, author, pages, haveRead, index) {
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
}

Library.addBookToLibrary(new Book("The Hobbit", "J.R.R. Tolkien", 295, true));
Library.addBookToLibrary(new Book("Dune", "Some Genius", 317, true));
Library.addBookToLibrary(new Book("50 Shades of Gray", "Some Idiot", 69, false));

DisplayHandler.init(Library);