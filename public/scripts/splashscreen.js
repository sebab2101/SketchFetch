export class splashscreen{
    loginForm;
    splashZone;
    unsplashZone;
    nameInput;
    submitButton;
    constructor(){
        this.splashZone = document.querySelector("#splash");
        this.unsplashZone = document.querySelector("#unsplash");
        this.loginForm = this.splashZone.querySelector("#loginForm");
        this.nameInput = this.loginForm.querySelector("#nameInput");
        this.submitButton = this.loginForm.querySelector("#loginSubmitButton");
    }

    get name(){
        return this.nameInput.value;
    }

    resetName(){
        this.nameInput.value ='';
    }

    toggleSplash(){
        this.splashZone.style.display = "none";
        this.unsplashZone.style.display = "block";
    }
}