import Utils from '../util';

class CassaForm {

  constructor(username, teamid, form, status, project, date, name, pdfPath, formName) {
    this.id = Utils.guid();
    this.username = username;
    this.teamId = teamid;
    this.form = form;
    this.project = project;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.date = date;
    this.name = name;
    this.pdfPath = pdfPath;
    this.formName = formName;
  }
}

export default CassaForm;