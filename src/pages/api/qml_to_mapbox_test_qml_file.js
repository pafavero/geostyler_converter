import QGISParser from "geostyler-qgis-parser";
import MapboxParser from "geostyler-mapbox-parser";
import getConfig from 'next/config'
import path from 'path'

var fs = require('fs');

// DO NOT LOOK TO REACT LIBRARY: GeoStyler is an Open Source React library 
// ONLY CONVERTER  https://geostyler.github.io/geostyler/latest/index.html

// from qgis qml
// https://github.com/geostyler/geostyler-qgis-parser
// to mapbox
// https://github.com/geostyler/geostyler-mapbox-parser

export default function handler(req, res) {

  const env = process.env.NODE_ENV
  let fileToConvert
  const qmlDirectory = path.join(process.cwd(), 'public/');
  const qgisParser = new QGISParser()
  const mapboxParser = new MapboxParser()
  fileToConvert = qmlDirectory + req.query.qml_file + '.qml'
  
  console.log('fileToConvert', fileToConvert)
  fs.readFile(fileToConvert, 'utf-8', function(err, fileContent) {
    if (err) {
      res.status(200).json('Error: file not found!')
      return;
    }
    qgisParser.readStyle(fileContent).then(({output: theirStyle}) => {
      // console.log('theirStyle', theirStyle)
      mapboxParser
        .writeStyle(theirStyle)
        .then(({output: mbStyle}) => {
          // console.log('mbStyle', mbStyle)
          const mbStyleObj = JSON.parse(mbStyle)
          mbStyleObj.ADDMYDUMMYCOMMENT = `convert ${fileToConvert} ==> mbox`
          res.status(200).json(mbStyleObj)
        }).catch(error => {console.error(error); res.status(200).json('Error')})
    }).catch(error => {console.error(error); res.status(200).json('Error')});
  });
}

  