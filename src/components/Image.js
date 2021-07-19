import React from 'react'
import styled from 'styled-components'
//below library is used for poping image when user click on the image
import ModalImage from 'react-modal-image'

//it consists of single image component
const Image = (image) => {
  return (
    <Single>
      <ModalImage small={image.url} large={image.url} alt={image.title} />
    </Single>
  )
}

//styling for above components
const Single = styled.div`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export default Image
