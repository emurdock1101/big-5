import React, {useEffect, useState} from 'react';
import './MadeToImage.css';

/*
 * The free "Made to Image" workbook, shown on the site at /made-to-image.
 *
 * The workbook is one self-contained page (its own styles and scripts), kept in
 * public/freebie/made-to-image.txt. The .txt name matters: the live site's hosting rule sends every
 * address without a known file ending back to the app, and .txt is one of the endings it lets through.
 * The page is loaded as text and shown in a frame under the site's header, so its styles never mix
 * with the site's. Answers are saved in the visitor's own browser, the same as before.
 *
 * To update the workbook: copy freebie/made-to-image-draft.html over public/freebie/made-to-image.txt.
 */

const SOURCE = '/freebie/made-to-image.txt';

const MadeToImage: React.FC = () => {
  const [doc, setDoc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const title = document.title;
    document.title = 'Made to Image · Personality+';
    let live = true;
    fetch(SOURCE)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((text) => live && setDoc(text))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
      document.title = title;
    };
  }, []);

  if (failed) {
    return (
      <div className='pp-wrap' style={{padding: '64px 16px', textAlign: 'center'}}>
        <p>The workbook didn't load. Please refresh the page to try again.</p>
      </div>
    );
  }

  return (
    <div className='pp-freebie'>
      {doc === null ? (
        <div className='pp-freebie__loading' aria-live='polite'>
          Opening your workbook…
        </div>
      ) : (
        <iframe className='pp-freebie__frame' title='Made to Image, a free workbook' srcDoc={doc} data-site='pp' />
      )}
    </div>
  );
};

export default MadeToImage;
