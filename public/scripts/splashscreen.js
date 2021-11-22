class splashscreen{
    loginForm;
    splashZone;
    unsplashZone;
    nameInput;
    submitButton;
    g;
    constructor(){
        this.splashZone = document.querySelector("#splash");
        this.unsplashZone = document.querySelector("#unsplash");
        this.loginForm = this.splashZone.querySelector("#loginForm");
        this.nameInput = this.loginForm.querySelector("#nameInput");
        this.submitButton = this.loginForm.querySelector("#loginSubmitButton");
    }
    
}