

export function EmailValidation(email: string): boolean{

    const re = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return re.test(String(email).toLowerCase());
}




export function PasswordValidation(password: string): boolean{

    let boolean = true;


    if (password.length < 6){
        boolean = false;
    }

    const specialChars = /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~]/;
    if (!specialChars.test(password)){
        boolean = false;
    }

    const numbersString = /[0-9]/;
    if (!numbersString.test(password)){
        boolean = false;
    }

    return boolean
}


// @ts-expect-error it doesn't fucking work otherwise
export function CheckEmailAndPassword(errorData, formData){

    const newErrorData:  typeof errorData = {
        TermsCheckbox: errorData.TermsCheckbox,
        email: errorData.email,
        password: errorData.password,
        confirmPassword: errorData.confirmPassword
    };

    let hasError = false;


    if (!formData.TermsCheckbox){
        newErrorData.TermsCheckbox = true;
        hasError = true
    }
    else{
        newErrorData.TermsCheckbox = false
    }



    if (!EmailValidation(formData.email) || formData.email.trim() == ""){
        newErrorData.email = true
        hasError = true
    }
    else{
        newErrorData.email = false
    }



    if (!PasswordValidation(formData.password) || formData.password.trim() == ""){
        newErrorData.password = true
        hasError = true
    }
    else{
        newErrorData.password = false
    }


    return {newErrorData, hasError}
}