import { IDisplayExtension, Instance } from "@veridid/workflow-parser";

export class ExtendedDisplay implements IDisplayExtension {
    async displays(instance: Instance, template: any): Promise<any>{
        console.log("^^^ Extension -> displays");
        // handle the types of actions
        switch(template.type) {
            case "extended":
                template.text= "Extended display render!!";
                break;
        }    
        return template;
    };
}