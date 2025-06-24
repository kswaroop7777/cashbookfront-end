export class globalProperties {
    public static genericError: string='Something went wrong. Please try again later.'

    public static nameRegx :string='([a-zA-Z0-9 ]*)'

    public static toastrConfig ={
        maxOpened:0,
        preventDuplicates:true,
        closeButton:true,
        timeOut:5000,
        easing:'ease-in',
        progressBar:true,
        toastClass:'ngx-toastr',
        positionClass:'toast-top-right',
        titleClass:'toast-title',
        messageClass:'toast-message',
        topToDismiss:true,

    }


    public static secret_key = 'a5ad7d1d39a60980075ad3b76e11b517e52ca9b6f235da69f167b189f27745e034999b07f0d0c2e2b4bcaa6496f0cd175681ec3ffa7f686a382a2ac51b17942218445fe8873be967d246a445faf02326c72cb9c8f91f9393470a57d197464700976124037fe5dde7e4f16730fef2e24d5a4e7adf6d2d6b8fad02eaf3e6a633cb'
}