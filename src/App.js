import React, { useState, useEffect } from 'react';
import './App.css';
import { useDropzone } from 'react-dropzone';

function App(props) {
  const [files, setFiles] = useState([]);
  const [response, setResponse] = useState('');
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const preview = files.map(file => (
    <div key={file.name}>
      <div>
        <img src={file.preview} alt='preview' />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  function postImage(img) {
    fetch('http://localhost:3001/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: img })
    })
      .then(res => {
        console.log(res.status);
        setResponse(res.status);
      })
      .catch(error => setResponse(JSON.stringify(error)));
  }

  return (
    <section className='App'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='button'>VELG BILDE</div>
      </div>

      {files.length !== 0 && (
        <>
          <p>Valgt bilde:</p>
          <aside>{preview}</aside>
          <div
            className='button'
            onClick={() => {
              const reader = new FileReader();
              files.forEach(file => {
                reader.readAsDataURL(file);
                reader.onloadend = function() {
                  var base64data = reader.result;
                  if (typeof base64data === 'string') {
                    postImage(base64data);
                  }
                };
              });
            }}
          >
            LAST OPP
          </div>
        </>
      )}

      <p>{response === 200 ? 'Bildet ble lastet opp' : response}</p>
    </section>
  );
}

export default App;
