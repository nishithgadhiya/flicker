import React from 'react'
import Image from './Image'
import styled from 'styled-components'

//it consists of div for images
const Images = ({ listOfImages }) => {
  let imgs
  if (listOfImages.length) {
    imgs = listOfImages.map((img) => {
      let id = img.id
      //url for image source
      let path = `https://farm${img.farm}.staticflickr.com/${img.server}/${img.id}_${img.secret}.jpg`
      return (
        <Image className="size" url={`${path}`} key={id} title={img.title} />
      )
    })
  }
  return <Gallery>{imgs}</Gallery>
}

//styling for above components
const Gallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  padding: 2rem 0rem;
  width: 85%;
  margin: auto;
  row-gap: 5rem;
  column-gap: 1rem;
`

export default Images
