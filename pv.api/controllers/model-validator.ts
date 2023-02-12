export function modelValidator(body: any, fields: { name: string, type: string }[]): { errorMessage: string } | null {
    let messages = '';

    fields.forEach(field => {
        console.log(field);
        console.log(body[field.name]);
        console.log(typeof (body[field.name]));
        console.log(typeof (body[field.name]) != field.type);
        if (body[field.name] === undefined) {
            messages += `${field.name} field missing. `;
        }
        if (typeof (body[field.name]) !== field.type) {
            messages += `field ${field.name} must be a ${field.type}. `;
        }
    });

    const nonZeroValues = fields.reduce((total, arg) => body[arg.name] + arg, 0) > 0;
    console.log(nonZeroValues);
    if (!nonZeroValues) {
        messages += 'at least one field should have value greater than 0';
    }

    if (messages !== '') {
        return { errorMessage: messages };
    }
    return null;
}