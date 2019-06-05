import desc from './desc'

test('desc: english, empty ID', () => {
  window.mstrDescriptors = {
    descriptors: {
      "mstrWeb.16243": "Save"
    }
  }
  expect(desc(null, 'Save')).toEqual("[Save]")
})

test('desc: english, valid ID', () => {
  window.mstrDescriptors = {
    descriptors: {
      "mstrWeb.16243": "Save"
    }
  }
  expect(desc(16243, 'Save')).toEqual("Save")
})

test('desc: english, invalid ID and empty Text', () => {
  window.mstrDescriptors = {
    descriptors: {
      "mstrWeb.16243": "Save"
    }
  }
  expect(desc(16244, null)).toEqual("[No string descriptor found for descID=16244]")
})
