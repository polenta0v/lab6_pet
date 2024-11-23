fetch('http://test3.is.op.edu.ua/api/Pet')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        data.forEach(renderHTML); // Render each card
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function renderHTML(cardData) {
    let box = document.createElement('div');
    box.className = 'box';
    box.id = cardData.id;

    let name = document.createElement('h1');
    name.textContent = cardData.name;

    let age = document.createElement('p');
    age.textContent = `Age: ${cardData.age}`;

    let type = document.createElement('p');
    type.textContent = `Type: ${cardData.type}`;

    let button = document.createElement('button');
    button.textContent = 'Редагувати';
    button.id = cardData.id;
    button.addEventListener('click', (e) => {
        let buttonId = e.target.id; // Получаем id кнопки

        let nameInput = document.getElementById('name-edit');
        let ageInput = document.getElementById('age-edit');
        let typeInput = document.getElementById('type-edit');

        nameInput.value = cardData.name;
        ageInput.value = cardData.age;
        typeInput.value = cardData.type;

        openModal('.back-edit');

        let closeBtn = document.getElementById('close-edit');
        closeBtn.addEventListener('click', () => closeModal('.back-edit'));

        let applyBtn = document.getElementById('apply-edit');
        applyBtn.addEventListener('click', () => {
            let updatedData = {
                id: buttonId,
                name: nameInput.value,
                age: ageInput.value,
                type: typeInput.value
            };


            fetch(`http://test3.is.op.edu.ua/api/Pet/${buttonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })
                .then(response => {
                    if (!response.ok) {
                        // Если ответ не успешный, выводим ошибку
                        return response.json().then(errorData => {
                            throw new Error(`Server responded with error: ${errorData.message || 'Unknown error'}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data updated successfully:', data);

                    closeModal('.back-edit');

                    updateCard(buttonId, updatedData);
                })
                .catch(error => {
                    console.error('Error updating data:', error);
                    alert(`Ошибка при обновлении данных: ${error.message}`);
                });
        });
    });

    function updateCard(id, updatedData) {
        let card = document.getElementById(id);
        if (card) {
            card.querySelector('h1').textContent = updatedData.name;
            card.querySelector('p:nth-of-type(1)').textContent = `Age: ${updatedData.age}`;
            card.querySelector('p:nth-of-type(2)').textContent = `Type: ${updatedData.type}`;
        }
    }

    let buttonDel = document.createElement('button');
    buttonDel.textContent = 'Видалити';
    buttonDel.style.margin = '5px';
    buttonDel.dataset.index = cardData.id;

    buttonDel.addEventListener('click', (e) => {
        let cardId = e.target.dataset.index;  // Получаем id карточки из dataset

        let confirmDelete = confirm('Вы уверены, что хотите удалить эту карточку?');
        if (!confirmDelete) return;

        let card = document.getElementById(cardId);
        if (card) {
            card.remove();
        }

        fetch(`http://test3.is.op.edu.ua/api/Pet/${cardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка при удалении: ${response.statusText}`);
                }
                console.log('Карточка успешно удалена с сервера');
            })
            .catch(error => {
                console.error('Ошибка при удалении данных:', error);
                alert(`Ошибка при удалении: ${error.message}`);
            });
    });


    box.appendChild(name);
    box.appendChild(age);
    box.appendChild(type);
    box.appendChild(button);
    box.appendChild(buttonDel);

    document.querySelector('.container').appendChild(box);
}

let addButton = document.getElementById('add');
let applyButton = document.getElementById('apply');
let closeButton = document.getElementById('close');

function openModal(modal) {
    document.querySelector(modal).classList.add('active');
}

function closeModal(modal) {
    document.querySelector(modal).classList.remove('active');
}

addButton.addEventListener('click', () => openModal('.back'));
closeButton.addEventListener('click', () => closeModal('.back'));


function addPet() {
    let name = document.getElementById('name').value;
    let age = document.getElementById('age').value;
    let type = document.getElementById('type').value;

    if (!name || !age || !type) {
        alert('Please fill out all fields!');
        return;
    }

    let id = crypto.randomUUID();

    let newCard = {
        id: id,
        name: name,
        age: age,
        type: type,
    };

    renderHTML(newCard);

    fetch('http://test3.is.op.edu.ua/api/Pet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Saved to server:', data);
        })
        .catch(error => console.error('Error saving data:', error));


    closeModal();
}

applyButton.addEventListener('click', addPet);

