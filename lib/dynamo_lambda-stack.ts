import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";
import * as appautoscaling from "aws-cdk-lib/aws-applicationautoscaling";

export class DynamoLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create table
    const table = new dynamodb.Table(this, id, {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      // readCapacity: 1,
      // writeCapacity: 1,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "createdAt", type: dynamodb.AttributeType.NUMBER },
      pointInTimeRecovery: true,
      tableName: "john",
    });

    console.log("Table name =>", table.tableName);
    console.log("Table arn =>", table.tableArn);

    //add local secondary index
    table.addLocalSecondaryIndex({
      indexName: "statusIndex",
      sortKey: { name: "status", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    //grant permissions
    table.grantReadData(new iam.AccountRootPrincipal());

    //grant read permission to lambda
    // table.grantReadData(lambdaName);

    //grant specific permission to lambda
    // table.grant(lambdaName, ["dynamodb:Query"]);

    /**
     * Auto Scaling Configurations for Provisioned databases
     *
     */

    //configure autoscaling on table
    // const writeAutoScalng = table.autoScaleWriteCapacity({
    //   maxCapacity: 2,
    //   minCapacity: 1,
    // });

    //scale up when write capacity hits 75%
    // writeAutoScalng.scaleOnUtilization({
    //   targetUtilizationPercent: 75,
    // });

    //scale up at 9am
    // writeAutoScalng.scaleOnSchedule("scale-up", {
    //   schedule: appautoscaling.Schedule.cron({ hour: "9", minute: "0" }),
    //   minCapacity: 2,
    // });

    //scale down in the afternoon
    // writeAutoScalng.scaleOnSchedule("scale-down", {
    //   schedule: appautoscaling.Schedule.cron({ hour: "14", minute: "0" }),
    //   maxCapacity: 2,
    // });
  }
}
