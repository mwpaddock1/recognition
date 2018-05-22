//button listeners
$('.sign-up-opening-button').on("click", function (event) {
    renderSignUpForm()
});
$('.login-opening-button').on("click", function (event) {
    renderLoginForm()
});

$('.login-banner-button').on('click', function (event) {
    renderLoginForm()
});

$('.cancel-button').on("click", function (event) {
    renderRestart()
});
$('.logout-button').on('click', function (event) {
    renderRestart()
});
// $('delete-employee-button').on("click", function (event) {});
$('.sign-in-button').on("click", function (event) {
    renderEmployeeList();
    console.log('going to Employee list page')
});
$('.employee-list-button').click(function (event) {
    renderEmployeeList()
});

$('.give-points-button').click(function (event) {
    $('.individual-info-container').removeClass('hidden');
    $('.individual-recognition-summary').addClass('hidden');
});
//render
function renderSignUpForm() {
    $('.thumbs-up').addClass('hidden');
    $('#js-sign-up-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('.sign-up-button').removeClass('hidden');
    $('.login-button').addClass('hidden');
    $('.login-opening-button').addClass('hidden');
    $('.sign-up-opening-button').addClass('hidden');
}

function renderLoginForm() {
    $('.thumbs-up').addClass('hidden');
    $('#js-login-form').removeClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('.login-button').addClass('hidden');
    $('.sign-in-button').removeClass('hidden');
    $('.login-banner-button').addClass('hidden');
    $('.sign-up-button').addClass('hidden');
    $('.sign-up-opening-button').addClass('hidden');
    $('.login-opening-button').addClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
};

function renderRestart() {
    $('#js-login-form').addClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
    $('.cancel-button').addClass('hidden');
    $('.login-button').removeClass('hidden');
    $('.sign-up-button').removeClass('hidden');
    $('.sign-up-opening-button').removeClass('hidden');
    $('.login-opening-button').removeClass('hidden');
    $('.thumbs-up').removeClass('hidden');
    $('.goals').addClass('hidden');
    $('.employee-list').addClass('hidden');
    $('.demo-credentials').removeClass('hidden');
    $('.goals').addClass('hidden');
    $('row.employee-boxes').empty();
    $('.employee-list').addClass('hidden');
    $('.demo-credentials').removeClass('hidden');
    $('.logout-button').addClass('hidden');
    $('.js-logged-in-employee').empty();
}

function renderEmployeeList() {
    console.log('listing the employees');
    $('#js-login-form').addClass('hidden');
    $('.goals').removeClass('hidden');
    $('.employee-list').removeClass('hidden');
    $('#js-sign-up-form').addClass('hidden');
    $('.demo-credentials').addClass('hidden');
    $('section.points-given').empty();
    $('section.points-received').empty();
    $('.employee-page-title').empty();
    $('.employee-list-button').addClass('hidden');
    $('.cancel-button').removeClass('hidden');
    $('.individual-recognition-summary').addClass('hidden');
    $('.individual-info-container').addClass('hidden');
    $('.login-banner-button').addClass('hidden')
};

function renderIndividualEmployeeRecognition() {
    $('.employee-list').addClass('hidden');
    $('.sign-in-button').addClass('hidden');
    $('.employee-list-button').removeClass('hidden');
    $('.cancel-button').addClass('hidden');
    $('.individual-recognition-summary').removeClass('hidden');
}