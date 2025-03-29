import { Injectable, OnModuleInit } from "@nestjs/common";
import {
    initDb,
    loadWorkflowsFromFile,
    getWorkflows,
  } from '@nas-veridid/workflow-parser';
import path from "path";
import { readFileSync } from "fs";

@Injectable()
export class WorkflowService implements OnModuleInit {
    
    async onModuleInit() {
        try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await initDb();

        // Adding delay after initializing the database
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // Load workflows from the JSON file if exists
        const workflowsFilePath = path.join(__dirname, '..', 'workflows.json');
        await loadWorkflowsFromFile(workflowsFilePath);

        // Validate workflows
        const workflowsFromFile = JSON.parse(
            readFileSync(workflowsFilePath, 'utf-8'),
        );
        const workflowsFromDb = await getWorkflows();

        if (workflowsFromFile.length === workflowsFromDb.length) {
            console.log(
            'No.of workflows in workflows.json and No.of workflows in workflow_db table workflows matches! Good ',
            );
        } else {
            console.error(
            'Error loading workflows: Mismatch in number of workflows.',
            );
        }
        } catch (error) {
            console.error('Error initializing workflows:', error.message);
        }
    }
}