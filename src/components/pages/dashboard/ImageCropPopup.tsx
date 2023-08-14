import Button from 'components/core/Button'
import Modal from 'components/core/Modal'
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'

function ImageCropPopup({
  isCropModalVisible,
  toggleIsCropModalVisible,
  image,
  onCropDone,
  onCropCancel
}: any) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)

  const onCropComplete = (
    _croppedAreaPercentage: any,
    croppedAreaPixels: any
  ) => {
    setCroppedArea(croppedAreaPixels)
  }

  const handleCloseModal = () => {
    isCropModalVisible && toggleIsCropModalVisible()
  }

  return (
    <Modal
      isVisible={isCropModalVisible}
      onClose={handleCloseModal}
      className='bg-[#53389e4d] backdrop-blur-[2px] z-[999]'
    >
      <div className='relative flex flex-col w-[300px] sm:w-[500px]'>
        <div className='relative h-[300px] sm:h-[500px] w-[300px] sm:w-[500px]'>
          <Cropper
            image={image}
            aspect={1}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                borderRadius: '8px 8px 0 0'
              }
            }}
          />
        </div>

        <div className='flex flex-row gap-2 p-2 m-auto'>
          <Button
            outlined
            onClick={onCropCancel}
            className='w-[120px] bg-white !border-[#e6e6e6] !text-[#667085] h-[2.2rem] lg:h-[3rem] !text-center !p-0'
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              onCropDone(croppedArea)
            }}
            className='w-[120px] h-[2.2rem] lg:h-[3rem] !p-0'
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ImageCropPopup
