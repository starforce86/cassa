import Realm from 'realm';
import CassaForm from '../models/form';

const repository = new Realm({
  schema: [{
    name: 'CassaForm',
    primaryKey: 'id',
    properties: {
      id: { type: 'string', indexed: true },
      username: 'string',
      teamId: 'int',
      form: 'string',
      project: 'string',
      status: 'string',
      createdAt: 'date',
      updatedAt: 'date',
      name: 'string',
      date: 'date',
      pdfPath: 'string',
      formName: 'string'
    }
  }]
});

const CassaFormRepo = {
  findAll: function (username) {
    const sortBy = [['updatedAt', true]];
    const records = repository.objects('CassaForm').sorted(sortBy);
    return records.filtered('username CONTAINS[c] $0', username);
  },

  save: function (form) {
    repository.write(() => {
      form.updatedAt = new Date();
      repository.create('CassaForm', form);
    })
  },

  findOne: function (id) {
    const record = repository.objectForPrimaryKey('CassaForm', id);
    return record;
  },

  update: function (form, callback) {
    if (!callback) return;
    repository.write(() => {
      form.updatedAt = new Date();
      repository.create('CassaForm', form, true);
      callback();
    });
  },

  delete: function (form) {
    repository.write(() => {
      const record = repository.objectForPrimaryKey('CassaForm', form);
      repository.delete(record);
    });
  },

};

export default CassaFormRepo;