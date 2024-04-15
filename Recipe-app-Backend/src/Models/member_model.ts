import mongoose from 'mongoose';

 export interface IMember {
    name: string;
    _id: string;
}

const memberSchema = new mongoose.Schema<IMember>({
    name: {
        type: String
        , required: true
    },
    _id: {
        type: String
        , required: true
    }
});

export default mongoose.model<IMember>('Member', memberSchema);

