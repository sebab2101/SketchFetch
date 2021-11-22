class splashscreen{
    loginForm;
    splashZone;
    unsplashZone;
    nameInput;
    g;
    constructor(){
        this.splashZone = document.querySelector("#splash");
        this.unsplashZone = document.querySelector("#unsplash");
        this.loginForm = this.splashZone.querySelector("#loginForm");
        this.nameInput = this.loginForm.querySelector("#nameInput");
    }
    
}