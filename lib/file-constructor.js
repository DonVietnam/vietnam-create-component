class FileConstructor {
  constructor( entityName ) {
    this.entityName = entityName;
  }

  getTemplate() {
    throw new Error( 'Not implemented!' );
  }
}

class ServiceConstructor extends FileConstructor {
  constructor( ...args ) {
    super( args );
    this.fileName = 'service.js';
  }

  getTemplate() {
    return `class ${ this.entityName }Service {
  constructor( core ) {
    this.core = core;
  }

  create( data ) {
    return this.core.db.insert( '${ this.entityName }', data, [ 'id' ] );
  }

  async get( id ) {
    return ( await this.core.db.select( '${ this.entityName }', null, { id } ) )[ 0 ];
  }

  list( filters, pages ) {
    return this.core.db.select( '${ this.entityName }', null, filters, [ 'id' ], pages );
  }

  async remove( id ) {
    return ( await this.core.db.delete( '${ this.entityName }', { id }, [ 'id' ] ) )[ 0 ];
  }

  async update( id, updates ) {
    return ( await this.core.db.update( '${ this.entityName }', updates, { id }, [ 'id' ] ) )[ 0 ];
  }
}

module.exports = ${ this.entityName }Service;`;
  }
}

class ControllerConstructor extends FileConstructor {
  constructor( ...args ) {
    super( args );
    this.fileName = 'controller.js';
  }

  getTemplate() {
    return `const ${ this.entityName }Service = require( './service' );

class ${ this.entityName }Controller {
  constructor( core ) {
    this.core = core;
    this.service = new ${ this.entityName }Service( core );
  }

  create( data ) {
    return this.service.create( data );
  }

  get( data ) {
    return this.service.get( data.id );
  }

  list( data ) {
    return this.service.list( data.filters, data.pages );
  }

  remove( data ) {
    return this.service.remove( data.id );
  }

  update( data ) {
    return this.service.update( data.id, data.updates );
  }
}

module.exports = ${ this.entityName }Controller;`;
  }
}

class SchemeConstructor extends FileConstructor {
  constructor( ...args ) {
    super( args );
    this.fileName = 'schemes.js';
  }

  getTemplate() {
    return `module.exports = {
  create: {
    type: 'object',
    required: [],
    properties: {},
    additionalProperties: false
  },

  get: {
    type: 'object',
    required: [ 'id' ],
    properties: {
      id: {
        type: 'string',
      }
    },
    additionalProperties: false
  },

  list: {
    type: 'object',
    required: [],
    properties: {
      itemsNumber: {
        type: 'string',
      },
      page: {
        type: 'string'
      }
    },
    additionalProperties: false
  },

  remove: {
    type: 'object',
    required: [ 'id' ],
    properties: {
      id: {
        type: 'string',
      }
    },
    additionalProperties: false
  },

  update: {
    type: 'object',
    required: [ 'id', 'updates' ],
    properties: {
      id: {
        type: 'string',
      },

      updates: {
        type: 'object',
        default: {},
        required: [],
        properties: {},
        additionalProperties: false
      }
    },
    additionalProperties: false
  },
};`;
  }
}

class IndexConstructor extends FileConstructor {
  constructor( ...args ) {
    super( args );
    this.fileName = 'index.js';
  }

  getTemplate() {
    return `const controller = require( './controller' );
const schemes = require( './schemes' );

module.exports = {
  controller,
  schemes
};`;
  }
}

class RouteConstructor extends FileConstructor {
  constructor( ...args ) {
    super( args );
    this.fileName = `${ this.entityName }.js`;
  }

  getTemplate() {
    return `const component = require( '../components/${ this.entityName }' );

module.exports = {
  Controller: component.controller,
  routes: [
    {
      method: 'POST',
      path: '/${ this.entityName }/create',
      secure: true,
      schema: component.schemes.create,
      handler: 'create',
      roles: []
    },
    {
      method: 'GET',
      path: '/${ this.entityName }/get',
      secure: true,
      schema: component.schemes.get,
      handler: 'get',
      roles: []
    },
    {
      method: 'GET',
      path: '/${ this.entityName }/list',
      secure: true,
      schema: component.schemes.list,
      handler: 'list',
      roles: []
    },
    {
      method: 'DELETE',
      path: '/${ this.entityName }/remove',
      secure: true,
      schema: component.schemes.remove,
      handler: 'remove',
      roles: []
    },
    {
      method: 'PATCH',
      path: '/${ this.entityName }/update',
      secure: true,
      schema: component.schemes.update,
      handler: 'update',
      roles: []
    }
  ]
};`;
  }
}

module.exports = {
  ServiceConstructor,
  ControllerConstructor,
  SchemeConstructor,
  IndexConstructor,
  RouteConstructor
};
