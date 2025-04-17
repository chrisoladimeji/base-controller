// src/workflow/workflow.controller.ts
import { Controller, Post, Body, Get, HttpStatus} from '@nestjs/common';
import { ApiTags, ApiResponse,ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { parse,getWorkflows,loadWorkflowsFromJson,updateWorkflowByID } from '@veridid/workflow-parser'

@ApiTags('Workflow')
@Controller()
export class WorkflowController {

  @Post('parse')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        connectionID: {
          type: 'string',
          format: 'uuid',
          example: 'a123e456-78d9-0abc-def1-234567890abc',
        },
        action: {
          type: 'object',
          properties: {
            workflowID: {
              type: 'string',
              example: 'root-menu',
            },
            actionID: {
              type: 'string',
              example: 'selectNewStudentOrientation',
            },
            data: {
              type: 'object',
              additionalProperties: true,
              example: {
                key: 'value',
              },
            },
          },
          required: ['workflowID', 'actionID'],
        },
      },
      required: ['connectionID', 'action'],
    },
  })
  @ApiResponse({ status: 200, description: 'Return workflow instance.' })

  async parseAction(
    @Body() body: { connectionID: string; action: { workflowID: string; actionID: string; data?: any } }
  ) {
    const { connectionID, action } = body;
    try {
      const displayData = await parse(connectionID, action);
      return { success: true, displayData };
    } catch (error) {
      console.error('Error parsing workflow:', error.message);
      return { success: false, error: error.message };
    }
  }
  @Get('get-workflows')
  @ApiResponse({status:HttpStatus.OK,description:"Traction workflows"})
  async getWorkflows() {
    let workflows;
    try{
      workflows = await getWorkflows();
      return workflows;
    } catch(error){
      console.error('Error getting workflows:', error.message);
      return {success:false, error:error.message };
    }
  }

  @Post('set-workflow')
  @ApiBody({ schema: { type: 'array', items: { type: 'object'} }, required: true, description: "Array of JSON objects" })
  @ApiCreatedResponse({status:HttpStatus.OK,description:"Added Workflow Successfully"})
  async setWorkflow(@Body() workflow) {
    try{
      const workflowString = JSON.stringify(workflow);
      await loadWorkflowsFromJson(workflowString);
      return {success:true, message:"Workflows loaded successfully"};

    } catch(error){
      console.error('Error adding workflows:', error.message);
      return {success:false, error:error.message };
    }
  }

  @Post('update-workflow')
  @ApiBody({ schema: { type: 'array', items: { type: 'object'} }, required: true, description: "Array of JSON objects" })
  @ApiCreatedResponse({status:HttpStatus.OK,description:"Updated Workflow Successfully"})
  async updateWorkflow(@Body() workflow) {
    try{
      await updateWorkflowByID(workflow.id, workflow);
      return {success:true, message:"Workflows updated successfully"};

    } catch(error){
      console.error('Error adding workflows:', error.message);
      return {success:false, error:error.message };
    }
  }
}
