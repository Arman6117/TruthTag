import mongoose, {Schema,Document} from "mongoose";

export interface IReport extends Document {
    userId:string;
    productName:string;
    netWeight:string;
    country:string;
    healthScore:number;
    healthRisks:string[];
    consumptionFrequency:string;
    alternatives:string[];
    ageSuitability:string;
    warningLabels:string[];
    createdAt:Date;
}

const ReportSchema = new Schema<IReport>({
    userId:{type:String,required:true},
    productName:{type:String,required:true},
    netWeight:{type:String,required:true},
    country:{type:String,required:true},
    healthScore:{type:Number,required:true},
    healthRisks:{type:[String],required:true},
    consumptionFrequency:{type:String,required:true},
    alternatives:{type:[String],required:true}, 
    ageSuitability:{type:String,required:true},
    warningLabels:{type:[String],required:true},
    createdAt:{type:Date,default:Date.now}
})
export const Report = mongoose.models.Report || mongoose.model<IReport>('Report',ReportSchema);