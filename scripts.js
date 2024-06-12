document.addEventListener('DOMContentLoaded', function() {
    let sliders = document.querySelectorAll('.slider');

    sliders.forEach(slider => {
        let images = slider.querySelectorAll('img');
        let currentIndex = 0;

        function showNextImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
        }

        setInterval(showNextImage, 3000);
    });

    document.getElementById('createAccountButton').addEventListener('click', function() {
        window.location.href = 'create-account.html';
    });

    document.getElementById('loginButton').addEventListener('click', function() {
        window.location.href = 'login.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createAccountForm').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Account created successfully');
        window.location.href = 'login.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Login successful');
        window.location.href = 'gpt homepage.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let seekersContainer = document.getElementById('seekersContainer');
    let seekerFormModal = document.getElementById('seekerFormModal');
    let commentsModal = document.getElementById('commentsModal');
    let commentInput = document.getElementById('commentInput');
    let commentsContainer = document.getElementById('commentsContainer');

    // Load data from localStorage
    function loadData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    }

    // Save data to localStorage
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function createSeekerElement(seeker) {
        let seekerElement = document.createElement('div');
        seekerElement.classList.add('seeker');
        seekerElement.innerHTML = `
            <h3>${seeker.companyName}</h3>
            <p>${seeker.offerBrief}</p>
            <p>${seeker.reason}</p>
            <p>${seeker.contact}</p>
            <a href="${seeker.website}" target="_blank">${seeker.website}</a>
            <div class="images slider" style="height :700px;">
                ${seeker.images.map(src => `<img src="${src}" alt="Seeker Image" class="sliding-image" style="height: 700px;">`).join('')}
            </div>
            <div class="rating">
                <span class="star" data-value="1">&#9734;</span>
                <span class="star" data-value="2">&#9734;</span>
                <span class="star" data-value="3">&#9734;</span>
                <label><input type="radio" name="rating-${seeker.id}" value="perfect"> Perfect</label>
                <label><input type="radio" name="rating-${seeker.id}" value="good"> Good</label>
                <label><input type="radio" name="rating-${seeker.id}" value="poor"> Poor</label>
            </div>
            <span class="view-comments">View Comments</span>
        `;
        seekerElement.querySelector('.view-comments').addEventListener('click', function() {
            commentsContainer.innerHTML = '';
            commentsModal.style.display = 'block';
            commentsModal.dataset.seekerId = seeker.id;
            let comments = loadData(`comments-${seeker.id}`);
            comments.forEach(comment => {
                let commentElement = document.createElement('div');
                commentElement.textContent = `${comment.username}: ${comment.text}`;
                commentsContainer.appendChild(commentElement);
            });
        });

        const images = seekerElement.querySelectorAll('.sliding-image');
        let currentIndex = 0;

        function slideImages() {
            images.forEach((img, index) => {
                img.classList.remove('active');
                if (index === currentIndex) {
                    img.classList.add('active');
                }
            });
            currentIndex = (currentIndex + 1) % images.length;
        }

        setInterval(slideImages, 3000);

        return seekerElement;
    }

    document.getElementById('joinSeekersButton').addEventListener('click', function() {
        seekerFormModal.style.display = 'block';
    });

    seekerFormModal.querySelector('.close').addEventListener('click', function() {
        seekerFormModal.style.display = 'none';
    });

    commentsModal.querySelector('.close').addEventListener('click', function() {
        commentsModal.style.display = 'none';
    });

    document.getElementById('seekerForm').addEventListener('submit', function(event) {
        event.preventDefault();

        let form = event.target;
        let seeker = {
            id: Date.now(),
            companyName: form.querySelector('input[type="text"]').value,
            offerBrief: form.querySelector('textarea').value,
            reason: form.querySelectorAll('textarea')[1].value,
            contact: form.querySelectorAll('input[type="text"]')[1].value,
            website: form.querySelector('input[type="url"]').value,
            images: []
        };

        let files = form.querySelector('input[type="file"]').files;
        if (files.length < 3) {
            alert('Please upload at least three photos.');
            return;
        }

        for (let file of files) {
            let reader = new FileReader();
            reader.onload = function(event) {
                seeker.images.push(event.target.result);
                if (seeker.images.length === files.length) {
                    let seekers = loadData('seekers');
                    seekers.push(seeker);
                    saveData('seekers', seekers);
                    seekersContainer.appendChild(createSeekerElement(seeker));
                    seekerFormModal.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('submitComment').addEventListener('click', function() {
        let username = prompt('Please enter your username:');
        if (!username) {
            alert('Username is required.');
            return;
        }
        let comment = commentInput.value;
        if (!comment) {
            alert('Comment is required.');
            return;
        }
        let seekerId = commentsModal.dataset.seekerId;
        let comments = loadData(`comments-${seekerId}`);
        comments.push({ username, text: comment });
        saveData(`comments-${seekerId}`, comments);

        let commentElement = document.createElement('div');
        commentElement.textContent = `${username}: ${comment}`;
        commentsContainer.appendChild(commentElement);
        commentInput.value = '';
    });

    seekersContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('star')) {
            let starValue = event.target.dataset.value;
            let stars = event.target.parentElement.querySelectorAll('.star');
            stars.forEach(star => {
                star.textContent = star.dataset.value <= starValue ? '★' : '☆';
            });
        }
    });

    function initialize() {
        let seekers = loadData('seekers');
        seekers.forEach(seeker => {
            seekersContainer.appendChild(createSeekerElement(seeker));
        });
    }

    initialize();
});

document.addEventListener('DOMContentLoaded', function() {
    let rentalsContainer = document.getElementById('rentalsContainer');
    let rentalFormModal = document.getElementById('rentalFormModal');
    let householdContainer = document.getElementById('householdContainer');
    let householdFormModal = document.getElementById('householdFormModal');

    function createRentalElement(rental) {
        let rentalElement = document.createElement('div');
        rentalElement.classList.add('rental');
        rentalElement.innerHTML = `
            <h3>${rental.rentalName}</h3>
            <p>${rental.offerBrief}</p>
            <p>${rental.reason}</p>
            <p>${rental.contact}</p>
            <a href="${rental.website}" target="_blank">${rental.website}</a>
            <div class="images slider">
                ${rental.images.map(src => `<img src="${src}" alt="Rental Image" class="sliding-image" style="height: 700px;">`).join('')}
            </div>
            <div class="rating">
                <span class="star" data-value="1">&#9734;</span>
                <span class="star" data-value="2">&#9734;</span>
                <span class="star" data-value="3">&#9734;</span>
                <label><input type="radio" name="rating-${rental.id}" value="perfect"> Perfect</label>
                <label><input type="radio" name="rating-${rental.id}" value="good"> Good</label>
                <label><input type="radio" name="rating-${rental.id}" value="poor"> Poor</label>
            </div>
            <span class="view-comments">View Comments</span>
        `;
        rentalElement.querySelector('.view-comments').addEventListener('click', function() {
            commentsContainer.innerHTML = '';
            commentsModal.style.display = 'block';
            commentsModal.dataset.rentalId = rental.id;
            let comments = loadData(`comments-${rental.id}`);
            comments.forEach(comment => {
                let commentElement = document.createElement('div');
                commentElement.textContent = `${comment.username}: ${comment.text}`;
                commentsContainer.appendChild(commentElement);
            });
        });

        const images = rentalElement.querySelectorAll('.sliding-image');
        let currentIndex = 0;

        function slideImages() {
            images.forEach((img, index) => {
                img.classList.remove('active');
                if (index === currentIndex) {
                    img.classList.add('active');
                }
            });
            currentIndex = (currentIndex + 1) % images.length;
        }

        setInterval(slideImages, 3000);

        return rentalElement;
    }

    function createHouseholdElement(household) {
        let householdElement = document.createElement('div');
        householdElement.classList.add('household');
        householdElement.innerHTML = `
            <h3>${household.householdName}</h3>
            <p>${household.offerBrief}</p>
            <p>${household.reason}</p>
            <p>${household.contact}</p>
            <a href="${household.website}" target="_blank">${household.website}</a>
            <div class="images slider">
                ${household.images.map(src => `<img src="${src}" alt="Household Image" class="sliding-image" style="height: 700px;">`).join('')}
            </div>
            <div class="rating">
                <span class="star" data-value="1">&#9734;</span>
                <span class="star" data-value="2">&#9734;</span>
                <span class="star" data-value="3">&#9734;</span>
                <label><input type="radio" name="rating-${household.id}" value="perfect"> Perfect</label>
                <label><input type="radio" name="rating-${household.id}" value="good"> Good</label>
                <label><input type="radio" name="rating-${household.id}" value="poor"> Poor</label>
            </div>
            <span class="view-comments">View Comments</span>
        `;
        householdElement.querySelector('.view-comments').addEventListener('click', function() {
            commentsContainer.innerHTML = '';
            commentsModal.style.display = 'block';
            commentsModal.dataset.householdId = household.id;
            let comments = loadData(`comments-${household.id}`);
            comments.forEach(comment => {
                let commentElement = document.createElement('div');
                commentElement.textContent = `${comment.username}: ${comment.text}`;
                commentsContainer.appendChild(commentElement);
            });
        });

        const images = householdElement.querySelectorAll('.sliding-image');
        let currentIndex = 0;

        function slideImages() {
            images.forEach((img, index) => {
                img.classList.remove('active');
                if (index === currentIndex) {
                    img.classList.add('active');
                }
            });
            currentIndex = (currentIndex + 1) % images.length;
        }

        setInterval(slideImages, 3000);

        return householdElement;
    }

    document.getElementById('addRentalsButton').addEventListener('click', function() {
        rentalFormModal.style.display = 'block';
    });

    document.getElementById('addHouseholdButton').addEventListener('click', function() {
        householdFormModal.style.display = 'block';
    });

    rentalFormModal.querySelector('.close').addEventListener('click', function() {
        rentalFormModal.style.display = 'none';
    });

    householdFormModal.querySelector('.close').addEventListener('click', function() {
        householdFormModal.style.display = 'none';
    });

    document.getElementById('rentalForm').addEventListener('submit', function(event) {
        event.preventDefault();

        let form = event.target;
        let rental = {
            id: Date.now(),
            rentalName: form.querySelector('input[type="text"]').value,
            offerBrief: form.querySelector('textarea').value,
            reason: form.querySelectorAll('textarea')[1].value,
            contact: form.querySelectorAll('input[type="text"]')[1].value,
            website: form.querySelector('input[type="url"]').value,
            images: []
        };

        let files = form.querySelector('input[type="file"]').files;
        if (files.length < 3) {
            alert('Please upload at least three photos.');
            return;
        }

        for (let file of files) {
            let reader = new FileReader();
            reader.onload = function(event) {
                rental.images.push(event.target.result);
                if (rental.images.length === files.length) {
                    let rentals = loadData('rentals');
                    rentals.push(rental);
                    saveData('rentals', rentals);
                    rentalsContainer.appendChild(createRentalElement(rental));
                    rentalFormModal.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('householdForm').addEventListener('submit', function(event) {
        event.preventDefault();

        let form = event.target;
        let household = {
            id: Date.now(),
            householdName: form.querySelector('input[type="text"]').value,
            offerBrief: form.querySelector('textarea').value,
            reason: form.querySelectorAll('textarea')[1].value,
            contact: form.querySelectorAll('input[type="text"]')[1].value,
            website: form.querySelector('input[type="url"]').value,
            images: []
        };

        let files = form.querySelector('input[type="file"]').files;
        if (files.length < 3) {
            alert('Please upload at least three photos.');
            return;
        }

        for (let file of files) {
            let reader = new FileReader();
            reader.onload = function(event) {
                household.images.push(event.target.result);
                if (household.images.length === files.length) {
                    let households = loadData('households');
                    households.push(household);
                    saveData('households', households);
                    householdContainer.appendChild(createHouseholdElement(household));
                    householdFormModal.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });

    function initializeRentals() {
        let rentals = loadData('rentals');
        rentals.forEach(rental => {
            rentalsContainer.appendChild(createRentalElement(rental));
        });
    }

    function initializeHouseholds() {
        let households = loadData('households');
        households.forEach(household => {
            householdContainer.appendChild(createHouseholdElement(household));
        });
    }

    initializeRentals();
    initializeHouseholds();
});
