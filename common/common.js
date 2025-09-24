export const handleValidation = (field) => {
    let result = "";
    if(field.validation){
        field.validation.forEach((valid, index) => {
            // Only add '|' if it's not the first item
            if (index > 0) {
                result += '|';
            }
            if(valid === 'min'){
                result += valid+`:${field.min}`;
            }else if(valid === 'max'){
                result += valid+`:${field.max}`;
            }else{
                result += valid;
            }
        });
    }

    return result;
};
