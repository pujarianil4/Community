import { useState } from "react";
import "./index.scss"; // Import global CSS file

type Props = {
  limit: number; // Limit for image uploads
};

type FormData = {
  text: string;
  images: File[];
  gifs: File[];
};

const UploadComponent: React.FC<Props> = ({ limit }) => {
  const [formData, setFormData] = useState<FormData>({
    text: "",
    images: [],
    gifs: [],
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedImages = Array.from(files).slice(0, limit); // Limiting uploads
      setFormData({
        ...formData,
        images: [...formData.images, ...selectedImages],
      });
    }
  };

  const handleGifUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedGifs = Array.from(files).slice(0, limit); // Limiting uploads
      setFormData({ ...formData, gifs: [...formData.gifs, ...selectedGifs] });
    }
  };

  const handleDeleteImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleDeleteGif = (index: number) => {
    const newGifs = [...formData.gifs];
    newGifs.splice(index, 1);
    setFormData({ ...formData, gifs: newGifs });
  };

  const handleTextChange = (text: string) => {
    setFormData({ ...formData, text });
  };

  const handleCancel = () => {
    setFormData({ text: "", images: [], gifs: [] });
  };

  const handleSubmit = () => {
    // Here you can handle submitting formData to another function or API call
    console.log("Form Data:", formData);
    // Optionally, clear form after submission
    setFormData({ text: "", images: [], gifs: [] });
  };

  return (
    <div className='container'>
      <div className='toolbar'>
        <label className='control'>
          <span role='img' aria-label='Image'>
            🖼️
          </span>
          <input
            type='file'
            accept='image/*'
            onChange={handleImageUpload}
            multiple
          />
        </label>
        <label className='control'>
          <span role='img' aria-label='GIF'>
            🎞️
          </span>
          <input
            type='file'
            accept='image/gif'
            onChange={handleGifUpload}
            multiple
          />
        </label>
        <button
          className='control'
          onClick={() => handleTextChange(`${formData.text} **Bold Text**`)}
        >
          <span role='img' aria-label='Bold'>
            B
          </span>
        </button>
        <button
          className='control'
          onClick={() => handleTextChange(`${formData.text} _Italic Text_`)}
        >
          <span role='img' aria-label='Italic'>
            I
          </span>
        </button>
        <button
          className='control'
          onClick={() => handleTextChange(`${formData.text} 😊`)}
        >
          <span role='img' aria-label='Emoji'>
            😊
          </span>
        </button>
      </div>
      <textarea
        className='textArea'
        value={formData.text}
        onChange={(e) => handleTextChange(e.target.value)}
        placeholder='Type your text here...'
      />
      <div className='uploadSection'>
        <div className='previewSection'>
          {formData.images.map((image, index) => (
            <div key={index} className='previewItem'>
              <img
                className='previewImage'
                src={URL.createObjectURL(image)}
                alt='Preview'
              />
              <button
                className='deleteButton'
                onClick={() => handleDeleteImage(index)}
              >
                Delete
              </button>
            </div>
          ))}
          {formData.gifs.map((gif, index) => (
            <div key={index} className='previewItem'>
              <img
                className='previewImage'
                src={URL.createObjectURL(gif)}
                alt='Preview'
              />
              <button
                className='deleteButton'
                onClick={() => handleDeleteGif(index)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='buttonSection'>
        <button className='cancelButton' onClick={handleCancel}>
          Cancel
        </button>
        <button className='submitButton' onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default UploadComponent;
