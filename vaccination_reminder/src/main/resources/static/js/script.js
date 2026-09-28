const API = "";

let owners = [];
let pets = [];
let vaccines = [];
let vaccinations = [];

let currentRole = "";


/* ================= LOGIN ================= */

function login() {

    const role =
        document.getElementById("loginRole").value;

    if (!role) {

        showPopup(
            "Missing Details",
            "Please select your role."
        );

        return;
    }

    currentRole = role;

    localStorage.setItem("role", role);

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("app")
        .classList.remove("hidden");

    document.getElementById("roleText").textContent =
        role === "OWNER"
            ? "Pet Owner"
            : "Hospital Employee";

    createNavigation();

    loadData();

}


/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("role");

    location.reload();
}


/* ================= START ================= */

document.addEventListener("DOMContentLoaded", function () {

    const role =
        localStorage.getItem("role");

    if (role) {

        currentRole = role;

        document
            .getElementById("loginPage")
            .classList.add("hidden");

        document
            .getElementById("app")
            .classList.remove("hidden");

        document.getElementById("roleText").textContent =
            role === "OWNER"
                ? "Pet Owner"
                : "Hospital Employee";

        createNavigation();

        loadData();
    }

});


/* ================= NAVIGATION ================= */

function createNavigation() {

    const nav =
        document.getElementById("navigation");

    nav.innerHTML = "";


    if (currentRole === "OWNER") {

        nav.innerHTML = `

            <button onclick="showPage('ownerDashboard')">
                Dashboard
            </button>

            <button onclick="showPage('myPetsPage')">
                My Pets
            </button>

            <button onclick="showPage('historyPage')">
                Vaccination History
            </button>

            <button onclick="showPage('ownerUpcomingPage')">
                Upcoming Vaccinations
            </button>

        `;

        showPage("ownerDashboard");

    }


    if (currentRole === "EMPLOYEE") {

        nav.innerHTML = `

            <button onclick="showPage('employeeDashboard')">
                Dashboard
            </button>

            <button onclick="showPage('ownersPage')">
                Owners
            </button>

            <button onclick="showPage('petsPage')">
                Pets
            </button>

            <button onclick="showPage('vaccinesPage')">
                Vaccine Types
            </button>

            <button onclick="showPage('vaccinationsPage')">
                Vaccinations
            </button>

            <button onclick="showPage('employeeUpcomingPage')">
                Upcoming
            </button>

        `;

        showPage("employeeDashboard");

    }

}


/* ================= SHOW PAGE ================= */

function showPage(id) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.add("hidden");

        });


    const page =
        document.getElementById(id);

    if (page) {
        page.classList.remove("hidden");
    }


    if (id === "ownerDashboard") {
        updateOwnerDashboard();
    }

    if (id === "myPetsPage") {
        displayMyPets();
    }

    if (id === "historyPage") {
        displayOwnerHistory();
    }

    if (id === "ownerUpcomingPage") {
        displayOwnerUpcoming();
    }

    if (id === "employeeDashboard") {
        updateEmployeeDashboard();
    }

    if (id === "ownersPage") {
        displayOwners();
    }

    if (id === "petsPage") {
        displayPets();
        loadOwnerOptions();
    }

    if (id === "vaccinesPage") {
        displayVaccines();
    }

    if (id === "vaccinationsPage") {
        displayVaccinations();

        loadPetOptions();

        loadVaccineOptions();
    }

    if (id === "employeeUpcomingPage") {
        displayEmployeeUpcoming();
    }

}


/* ================= API ================= */

async function apiRequest(
    url,
    method = "GET",
    data = null
) {

    try {

        const options = {
            method: method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        if (data !== null) {

            options.body =
                JSON.stringify(data);
        }


        const response =
            await fetch(API + url, options);


        if (!response.ok) {

            throw new Error(
                "Request failed."
            );
        }


        if (response.status === 204) {
            return null;
        }


        const text =
            await response.text();

        return text
            ? JSON.parse(text)
            : null;

    }

    catch (error) {

        console.error(error);

        showPopup(
            "Error",
            "Unable to complete the request."
        );

        return null;
    }
}


/* ================= LOAD DATA ================= */

async function loadData() {

    const ownerData =
        await apiRequest("/owners");

    if (ownerData) {
        owners = ownerData;
    }


    const petData =
        await apiRequest("/pets");

    if (petData) {
        pets = petData;
    }


    const vaccineData =
        await apiRequest("/vaccine-types");

    if (vaccineData) {
        vaccines = vaccineData;
    }


    const vaccinationData =
        await apiRequest("/vaccinations");

    if (vaccinationData) {
        vaccinations = vaccinationData;
    }


    updateOwnerDashboard();

    updateEmployeeDashboard();

}


/* =====================================================
   OWNER
   ===================================================== */

function getCurrentOwner() {

    /*
       Your current login does not yet collect
       the owner's ID.

       For now, if your owner login is connected
       to an owner ID later, this function can
       be changed to use that ID.
    */

    return owners[0] || null;
}


function getOwnerPets() {

    const owner =
        getCurrentOwner();

    if (!owner) {
        return [];
    }

    return pets.filter(
        pet =>
            pet.owner &&
            pet.owner.id == owner.id
    );
}


function getOwnerVaccinations() {

    const ownerPets =
        getOwnerPets();

    const petIds =
        ownerPets.map(pet => pet.id);

    return vaccinations.filter(
        vaccination =>
            vaccination.pet &&
            petIds.includes(
                vaccination.pet.id
            )
    );
}


function updateOwnerDashboard() {

    if (currentRole !== "OWNER") {
        return;
    }

    const ownerPets =
        getOwnerPets();

    const ownerVaccinations =
        getOwnerVaccinations();


    document.getElementById("myPetCount").textContent =
        ownerPets.length;


    document.getElementById("myVaccinationCount").textContent =
        ownerVaccinations.length;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const upcoming =
        ownerVaccinations.filter(
            v =>
                v.nextDueDate &&
                v.nextDueDate >= today
        );


    document.getElementById("myUpcomingCount").textContent =
        upcoming.length;
}


function displayMyPets() {

    const table =
        document.getElementById("myPetsTable");

    table.innerHTML = "";

    const ownerPets =
        getOwnerPets();


    ownerPets.forEach(pet => {

        table.innerHTML += `

            <tr>

                <td>${pet.id ?? ""}</td>

                <td>${pet.name ?? ""}</td>

                <td>${pet.species ?? ""}</td>

                <td>${pet.breed ?? ""}</td>

                <td>${pet.dateOfBirth ?? ""}</td>

            </tr>

        `;

    });
}


function displayOwnerHistory() {

    const table =
        document.getElementById("historyTable");

    table.innerHTML = "";


    const records =
        getOwnerVaccinations();


    records.forEach(v => {

        table.innerHTML += `

            <tr>

                <td>
                    ${v.pet?.name ?? ""}
                </td>

                <td>
                    ${v.vaccineType?.name ?? ""}
                </td>

                <td>
                    ${v.vaccinationDate ?? ""}
                </td>

                <td>
                    ${v.nextDueDate ?? ""}
                </td>

            </tr>

        `;

    });
}


function displayOwnerUpcoming() {

    const table =
        document.getElementById(
            "ownerUpcomingTable"
        );

    table.innerHTML = "";


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const records =
        getOwnerVaccinations()
            .filter(
                v =>
                    v.nextDueDate &&
                    v.nextDueDate >= today
            );


    records.forEach(v => {

        table.innerHTML += `

            <tr>

                <td>
                    ${v.pet?.name ?? ""}
                </td>

                <td>
                    ${v.vaccineType?.name ?? ""}
                </td>

                <td>
                    ${v.nextDueDate ?? ""}
                </td>

            </tr>

        `;

    });
}


/* =====================================================
   EMPLOYEE DASHBOARD
   ===================================================== */

function updateEmployeeDashboard() {

    if (currentRole !== "EMPLOYEE") {
        return;
    }


    document.getElementById("totalOwners").textContent =
        owners.length;


    document.getElementById("totalPets").textContent =
        pets.length;


    document.getElementById("totalVaccinations").textContent =
        vaccinations.length;


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const upcoming =
        vaccinations.filter(
            v =>
                v.nextDueDate &&
                v.nextDueDate >= today
        );


    document.getElementById("totalUpcoming").textContent =
        upcoming.length;
}


/* =====================================================
   OWNERS - EMPLOYEE
   ===================================================== */

function displayOwners() {

    const table =
        document.getElementById("ownerTable");

    table.innerHTML = "";


    owners.forEach(owner => {

        table.innerHTML += `

            <tr>

                <td>${owner.id ?? ""}</td>

                <td>${owner.name ?? ""}</td>

                <td>${owner.email ?? ""}</td>

                <td>${owner.phone ?? ""}</td>

                <td>

                    <button
                        class="edit"
                        onclick="editOwner(${owner.id})">
                        Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deleteOwner(${owner.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });
}


async function saveOwner() {

    const id =
        document.getElementById("ownerId").value;

    const name =
        document.getElementById("ownerName").value.trim();

    const email =
        document.getElementById("ownerEmail").value.trim();

    const phone =
        document.getElementById("ownerPhone").value.trim();


    if (!name || !email || !phone) {

        showPopup(
            "Missing Details",
            "Please fill all owner details."
        );

        return;
    }


    const data = {
        name,
        email,
        phone
    };


    const result =
        id
            ? await apiRequest(
                "/owners/" + id,
                "PUT",
                data
            )
            : await apiRequest(
                "/owners",
                "POST",
                data
            );


    if (result !== null) {

        showPopup(
            "Success",
            id
                ? "Owner updated successfully."
                : "Owner added successfully."
        );

        clearOwnerForm();

        await loadData();

        showPage("ownersPage");
    }
}


function editOwner(id) {

    const owner =
        owners.find(o => o.id == id);

    if (!owner) {
        return;
    }


    document.getElementById("ownerId").value =
        owner.id;

    document.getElementById("ownerName").value =
        owner.name || "";

    document.getElementById("ownerEmail").value =
        owner.email || "";

    document.getElementById("ownerPhone").value =
        owner.phone || "";
}


async function deleteOwner(id) {

    if (!confirm(
        "Are you sure you want to delete this owner?"
    )) {
        return;
    }


    const result =
        await apiRequest(
            "/owners/" + id,
            "DELETE"
        );


    if (result !== null) {

        showPopup(
            "Deleted",
            "Owner deleted successfully."
        );

        await loadData();

        showPage("ownersPage");
    }
}


function clearOwnerForm() {

    document.getElementById("ownerId").value = "";

    document.getElementById("ownerName").value = "";

    document.getElementById("ownerEmail").value = "";

    document.getElementById("ownerPhone").value = "";
}


/* =====================================================
   PETS - EMPLOYEE
   ===================================================== */

function displayPets() {

    const table =
        document.getElementById("petTable");

    table.innerHTML = "";


    pets.forEach(pet => {

        table.innerHTML += `

            <tr>

                <td>${pet.id ?? ""}</td>

                <td>${pet.name ?? ""}</td>

                <td>${pet.species ?? ""}</td>

                <td>${pet.breed ?? ""}</td>

                <td>${pet.dateOfBirth ?? ""}</td>

                <td>${pet.owner?.name ?? ""}</td>

                <td>

                    <button
                        class="edit"
                        onclick="editPet(${pet.id})">
                        Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deletePet(${pet.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });
}


function loadOwnerOptions() {

    const select =
        document.getElementById("petOwner");

    select.innerHTML =
        `<option value="">Select Owner</option>`;


    owners.forEach(owner => {

        select.innerHTML += `

            <option value="${owner.id}">
                ${owner.name}
            </option>

        `;

    });
}


async function savePet() {

    const id =
        document.getElementById("petId").value;

    const name =
        document.getElementById("petName").value.trim();

    const species =
        document.getElementById("petSpecies").value.trim();

    const breed =
        document.getElementById("petBreed").value.trim();

    const dateOfBirth =
        document.getElementById("petDob").value;

    const ownerId =
        document.getElementById("petOwner").value;


    if (
        !name ||
        !species ||
        !breed ||
        !dateOfBirth ||
        !ownerId
    ) {

        showPopup(
            "Missing Details",
            "Please fill all pet details."
        );

        return;
    }


    const data = {

        name,
        species,
        breed,

        dateOfBirth,

        owner: {
            id: Number(ownerId)
        }

    };


    const result =
        id
            ? await apiRequest(
                "/pets/" + id,
                "PUT",
                data
            )
            : await apiRequest(
                "/pets",
                "POST",
                data
            );


    if (result !== null) {

        showPopup(
            "Success",
            id
                ? "Pet updated successfully."
                : "Pet added successfully."
        );

        clearPetForm();

        await loadData();

        showPage("petsPage");
    }
}


function editPet(id) {

    const pet =
        pets.find(p => p.id == id);

    if (!pet) {
        return;
    }


    document.getElementById("petId").value =
        pet.id;

    document.getElementById("petName").value =
        pet.name || "";

    document.getElementById("petSpecies").value =
        pet.species || "";

    document.getElementById("petBreed").value =
        pet.breed || "";

    document.getElementById("petDob").value =
        pet.dateOfBirth || "";

    document.getElementById("petOwner").value =
        pet.owner?.id || "";
}


async function deletePet(id) {

    if (!confirm(
        "Are you sure you want to delete this pet?"
    )) {
        return;
    }


    const result =
        await apiRequest(
            "/pets/" + id,
            "DELETE"
        );


    if (result !== null) {

        showPopup(
            "Deleted",
            "Pet deleted successfully."
        );

        await loadData();

        showPage("petsPage");
    }
}


function clearPetForm() {

    document.getElementById("petId").value = "";

    document.getElementById("petName").value = "";

    document.getElementById("petSpecies").value = "";

    document.getElementById("petBreed").value = "";

    document.getElementById("petDob").value = "";

    document.getElementById("petOwner").value = "";
}


/* =====================================================
   VACCINE TYPES
   ===================================================== */

function displayVaccines() {

    const table =
        document.getElementById("vaccineTable");

    table.innerHTML = "";


    vaccines.forEach(vaccine => {

        table.innerHTML += `

            <tr>

                <td>${vaccine.id ?? ""}</td>

                <td>${vaccine.name ?? ""}</td>

                <td>${vaccine.description ?? ""}</td>

                <td>

                    <button
                        class="edit"
                        onclick="editVaccine(${vaccine.id})">
                        Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deleteVaccine(${vaccine.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });
}


async function saveVaccine() {

    const id =
        document.getElementById("vaccineId").value;

    const name =
        document.getElementById("vaccineName").value.trim();

    const description =
        document.getElementById("vaccineDescription").value.trim();


    if (!name || !description) {

        showPopup(
            "Missing Details",
            "Please fill all vaccine details."
        );

        return;
    }


    const data = {
        name,
        description
    };


    const result =
        id
            ? await apiRequest(
                "/vaccine-types/" + id,
                "PUT",
                data
            )
            : await apiRequest(
                "/vaccine-types",
                "POST",
                data
            );


    if (result !== null) {

        showPopup(
            "Success",
            id
                ? "Vaccine updated successfully."
                : "Vaccine added successfully."
        );

        clearVaccineForm();

        await loadData();

        showPage("vaccinesPage");
    }
}


function editVaccine(id) {

    const vaccine =
        vaccines.find(v => v.id == id);

    if (!vaccine) {
        return;
    }


    document.getElementById("vaccineId").value =
        vaccine.id;

    document.getElementById("vaccineName").value =
        vaccine.name || "";

    document.getElementById("vaccineDescription").value =
        vaccine.description || "";
}


async function deleteVaccine(id) {

    if (!confirm(
        "Are you sure you want to delete this vaccine?"
    )) {
        return;
    }


    const result =
        await apiRequest(
            "/vaccine-types/" + id,
            "DELETE"
        );


    if (result !== null) {

        showPopup(
            "Deleted",
            "Vaccine type deleted successfully."
        );

        await loadData();

        showPage("vaccinesPage");
    }
}


function clearVaccineForm() {

    document.getElementById("vaccineId").value = "";

    document.getElementById("vaccineName").value = "";

    document.getElementById("vaccineDescription").value = "";
}


/* =====================================================
   VACCINATIONS
   ===================================================== */

function loadPetOptions() {

    const select =
        document.getElementById("vaccinationPet");

    select.innerHTML =
        `<option value="">Select Pet</option>`;


    pets.forEach(pet => {

        select.innerHTML += `

            <option value="${pet.id}">
                ${pet.name}
            </option>

        `;

    });
}


function loadVaccineOptions() {

    const select =
        document.getElementById("vaccinationVaccine");

    select.innerHTML =
        `<option value="">Select Vaccine</option>`;


    vaccines.forEach(vaccine => {

        select.innerHTML += `

            <option value="${vaccine.id}">
                ${vaccine.name}
            </option>

        `;

    });
}


function displayVaccinations() {

    const table =
        document.getElementById(
            "vaccinationTable"
        );

    table.innerHTML = "";


    vaccinations.forEach(v => {

        table.innerHTML += `

            <tr>

                <td>${v.id ?? ""}</td>

                <td>${v.pet?.name ?? ""}</td>

                <td>${v.vaccineType?.name ?? ""}</td>

                <td>${v.vaccinationDate ?? ""}</td>

                <td>${v.nextDueDate ?? ""}</td>

                <td>

                    <button
                        class="edit"
                        onclick="editVaccination(${v.id})">
                        Edit
                    </button>

                    <button
                        class="delete"
                        onclick="deleteVaccination(${v.id})">
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });
}


async function saveVaccination() {

    const id =
        document.getElementById(
            "vaccinationId"
        ).value;

    const petId =
        document.getElementById(
            "vaccinationPet"
        ).value;

    const vaccineId =
        document.getElementById(
            "vaccinationVaccine"
        ).value;

    const vaccinationDate =
        document.getElementById(
            "vaccinationDate"
        ).value;

    const nextDueDate =
        document.getElementById(
            "nextDueDate"
        ).value;


    if (
        !petId ||
        !vaccineId ||
        !vaccinationDate ||
        !nextDueDate
    ) {

        showPopup(
            "Missing Details",
            "Please fill all vaccination details."
        );

        return;
    }


    const data = {

        vaccinationDate,

        nextDueDate,

        pet: {
            id: Number(petId)
        },

        vaccineType: {
            id: Number(vaccineId)
        }

    };


    const result =
        id
            ? await apiRequest(
                "/vaccinations/" + id,
                "PUT",
                data
            )
            : await apiRequest(
                "/vaccinations",
                "POST",
                data
            );


    if (result !== null) {

        showPopup(
            "Success",
            id
                ? "Vaccination updated successfully."
                : "Vaccination added successfully."
        );

        clearVaccinationForm();

        await loadData();

        showPage("vaccinationsPage");
    }
}


function editVaccination(id) {

    const v =
        vaccinations.find(
            vaccination =>
                vaccination.id == id
        );

    if (!v) {
        return;
    }


    document.getElementById(
        "vaccinationId"
    ).value = v.id;


    document.getElementById(
        "vaccinationPet"
    ).value =
        v.pet?.id || "";


    document.getElementById(
        "vaccinationVaccine"
    ).value =
        v.vaccineType?.id || "";


    document.getElementById(
        "vaccinationDate"
    ).value =
        v.vaccinationDate || "";


    document.getElementById(
        "nextDueDate"
    ).value =
        v.nextDueDate || "";
}


async function deleteVaccination(id) {

    if (!confirm(
        "Are you sure you want to delete this vaccination?"
    )) {
        return;
    }


    const result =
        await apiRequest(
            "/vaccinations/" + id,
            "DELETE"
        );


    if (result !== null) {

        showPopup(
            "Deleted",
            "Vaccination deleted successfully."
        );

        await loadData();

        showPage("vaccinationsPage");
    }
}


function clearVaccinationForm() {

    document.getElementById(
        "vaccinationId"
    ).value = "";

    document.getElementById(
        "vaccinationPet"
    ).value = "";

    document.getElementById(
        "vaccinationVaccine"
    ).value = "";

    document.getElementById(
        "vaccinationDate"
    ).value = "";

    document.getElementById(
        "nextDueDate"
    ).value = "";
}


/* =====================================================
   UPCOMING - EMPLOYEE
   ===================================================== */

function displayEmployeeUpcoming() {

    const table =
        document.getElementById(
            "employeeUpcomingTable"
        );

    table.innerHTML = "";


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    vaccinations
        .filter(
            v =>
                v.nextDueDate &&
                v.nextDueDate >= today
        )
        .forEach(v => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${v.pet?.name ?? ""}
                    </td>

                    <td>
                        ${v.pet?.owner?.name ?? ""}
                    </td>

                    <td>
                        ${v.vaccineType?.name ?? ""}
                    </td>

                    <td>
                        ${v.nextDueDate ?? ""}
                    </td>

                </tr>

            `;

        });
}


/* =====================================================
   POPUP
   ===================================================== */

function showPopup(title, message) {

    document.getElementById(
        "popupTitle"
    ).textContent = title;


    document.getElementById(
        "popupMessage"
    ).textContent = message;


    document.getElementById(
        "popup"
    ).classList.remove("hidden");
}


function closePopup() {

    document.getElementById(
        "popup"
    ).classList.add("hidden");
}