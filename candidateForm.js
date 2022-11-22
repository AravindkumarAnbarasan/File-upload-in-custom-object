import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import candidateName from '@salesforce/schema/Candidate_Information__c.Name';
import uploadFile from '@salesforce/apex/CandidateInsert.uploadFile'
export default class CandidateForm extends LightningElement {
    
    fileData
    @track candidateDetail = {Name:candidateName};
    handleName(event) {
        this.candidateDetail.Name = event.target.value;
    }
    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }
    
    handleClick(){
        const {base64, filename } = this.fileData
        uploadFile({ base64, filename , candidateRecord:this.candidateDetail })
        .then(result=>{
            this.fileData = null
            let title = 'Application Submitted successfully!!'
            let variant = 'success';
            this.toast(title,variant)
        })
    }

    toast(title,variant){
        const toastEvent = new ShowToastEvent({
            title, 
            variant 
        })
        this.dispatchEvent(toastEvent)
        window.location.reload();
    }
}