#!/usr/bin/env node

const fsp = require( 'fs/promises' );
const path = require( 'path' );
const { capitalize } = require( './lib/helpers' );
const {
  ServiceConstructor,
  ControllerConstructor,
  SchemeConstructor,
  IndexConstructor,
  RouteConstructor,
} = require( './lib/file-constructor' );

const COMPONENTS_PATH = 'src/components';
const ROUTES_PATH = 'src/routes';
const WORKING_DIRECTORY = process.cwd();
const COMPONENT_NAME = process.argv[ 2 ].toLowerCase();
const CAP_NAME = capitalize( COMPONENT_NAME );

const generationScheme = {
  component: {
    path: path.resolve( WORKING_DIRECTORY, COMPONENTS_PATH, COMPONENT_NAME ),
    constructors: [
      new ServiceConstructor( CAP_NAME ),
      new ControllerConstructor( CAP_NAME ),
      new SchemeConstructor( CAP_NAME ),
      new IndexConstructor()
    ]
  },
  route: {
    path: path.resolve( WORKING_DIRECTORY, ROUTES_PATH ),
    constructors: [
      new RouteConstructor( COMPONENT_NAME )
    ],
  }
};

( async () => {
  for ( const part in generationScheme ) {
    for ( const fileConstructor of generationScheme[ part ].constructors ) {
      await fsp.mkdir( generationScheme[ part ].path, { recursive: true } );
      await fsp.writeFile( path.resolve( generationScheme[ part ].path, fileConstructor.fileName ),
        fileConstructor.getTemplate() );
    }
  }
} )();
