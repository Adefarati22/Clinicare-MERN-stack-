import { ZodError } from "zod";

export const validateFormData = (schema) => (req, res, next)=> {
    try {
        // receive and transform data gotten from the client through the req.body, parse is past data
        const parsedData = schema.parse(req.body)
        req.body = parsedData; //transformed data with no error- forms should only be gotten from the req.body
        next() // call the next action thats supposed to happen - invoke the api func
    } catch (error) {
        if(error instanceof ZodError) {
            const errorMessages = error.issues.map((issue) => ({
                message: `${issue.path.join(".")} is ${issue.message}`, //all the message in our dataSchema, it is going to be stored in the message here
            }));
            return res.status(400).json({
                error: "Validation failed",
                details: errorMessages,
            });
        }
        next(error) //pass error to next handler
    }
}