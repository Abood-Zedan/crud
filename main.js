const name = document.querySelector('#courseName');
const category = document.querySelector('#courseCategory');
const price = document.querySelector('#coursePrice');
const description = document.querySelector('#courseDescription');
const capacity = document.querySelector('#courseCapacity');
const addBt = document.querySelector('#click');
const save = document.querySelector('#save');
const invalidName = document.querySelector('.invalid-name');
const invalidCategory = document.querySelector('.invalid-category');
const invalidPrice = document.querySelector('.invalid-price');
const invalidCapacity = document.querySelector('.invalid-capacity');
const search= document.querySelector('#search');
let courses = [];

if (localStorage.getItem('courses') != null) {
    courses = JSON.parse(localStorage.getItem('courses'));
    displayCourses();
}
addBt.addEventListener('click', (e) => {
    e.preventDefault();

    let isVaild = true;

    const namePattern = /^[A-Z][a-z]{2,10}$/;
    if (!namePattern.test(name.value)) {
        invalidName.innerHTML = 'this name is invalid , it must start whit a capital letter and contain in 2-10 char small letters';
        name.classList.add('is-invalid');
        isVaild = false;
    } else {
        invalidName.innerHTML = '';
        name.classList.remove('is-invalid');
        name.classList.add('is-valid');
    }

    const categoryPattern = /^[A-Z][a-z]{2,3}$/;
    if (!categoryPattern.test(category.value)) {
        invalidCategory.innerHTML = 'this category is invalid , it must start whit a capital letter and contain in 2-3 char small letters';
        category.classList.add('is-invalid');
        isVaild = false;
    } else {
        invalidCategory.innerHTML = '';
        category.classList.remove('is-invalid');
        category.classList.add('is-valid');
    }

    const pricePattern = /^[0-9]{3}$/;
    if (!pricePattern.test(price.value)) {
        invalidPrice.innerHTML = 'this price is invalid , it must be between $100 and $999';
        price.classList.add('is-invalid');
        isVaild = false;
    } else {
        invalidPrice.innerHTML = '';
        price.classList.remove('is-invalid');
        price.classList.add('is-valid');
    }

    const capacityPattern = /\b(2[0-9]|[3-9][0-9]|1[01][0-9]|120)\b/;
    if (!capacityPattern.test(capacity.value)) {
        invalidCapacity.innerHTML = 'this capacity is invalid , it must be between 20 and 120 students';
        capacity.classList.add('is-invalid');
        isVaild = false;
    } else {
        invalidCapacity.innerHTML = '';
        capacity.classList.remove('is-invalid');
        capacity.classList.add('is-valid');
    }

    if (isVaild) {
        const course = {
            name: name.value,
            category: category.value,
            price: price.value,
            descripion: description.value,
            capacity: capacity.value,
        };
        courses.push(course);

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: `${course.name} course added`
        });

        localStorage.setItem('courses', JSON.stringify(courses));
        displayCourses();
    }
});

function displayCourses() {
    const result = courses.map((course, index) => {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${course.name}</td>
                <td>${course.category}</td>
                <td>$${course.price}</td>
                <td>${course.descripion}</td>
                <td>${course.capacity}</td>
                <td><button class='btn btn-success' onclick='updateCourse(${index})'>UpDate</button></td>
                <td><button class='btn btn-danger' onclick='deleteCourse(${index})'>Delete</button></td>
                </tr>
        `;
    }).join(' ');

    document.querySelector('table #data').innerHTML = result;
}

function deleteCourse(index) {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            courses.splice(index, 1);
            localStorage.setItem('courses', JSON.stringify(courses));
            displayCourses();
            swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: `The course has been deleted.`,
                icon: "success"
            });
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
            });
        }
    });
};

function updateCourse(index) {
    name.value = courses[index].name
    category.value = courses[index].category;
    price.value = courses[index].price;
    description.value = courses[index].descripion;
    capacity.value = courses[index].capacity;
    save.classList.remove('ds-n');
    addBt.classList.add('ds-n');
    document.querySelector('#clear').classList.add('ds-n');
    save.addEventListener('click', () => saveUpdate(index));
}

function saveUpdate(index) {
    courses[index].name = name.value;
    courses[index].category = category.value;
    courses[index].price = price.value;
    courses[index].descripion = description.value;
    courses[index].capacity = capacity.value;
    localStorage.setItem('courses', JSON.stringify(courses));
    displayCourses();
    save.classList.add('ds-n');
}

search.addEventListener('input', (e) => {
    const keywords = search.value;
    const coursesResult = courses.filter((course) => {
        return course.name.toLowerCase().includes(keywords.toLowerCase());
    })
    const result = coursesResult.map((course, index) => {
        return `
            <tr>
                <td>${index + 1}</td>
                <td>${course.name}</td>
                <td>${course.category}</td>
                <td>$${course.price}</td>
                <td>${course.descripion}</td>
                <td>${course.capacity}</td>
                <td><button class='btn btn-success' onclick='updateCourse(${index})'>UpDate</button></td>
                <td><button class='btn btn-danger' onclick='deleteCourse(${index})'>Delete</button></td>
                </tr>
        `;
    }).join(' ');

    document.querySelector('table #data').innerHTML = result;
})