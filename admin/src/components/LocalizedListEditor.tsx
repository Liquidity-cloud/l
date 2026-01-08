import { Input, Button } from './FormElements'

interface TextStyle {
  fontSize?: string
  fontColor?: string
  fontFamily?: string
  fontWeight?: string
}

interface LocalizedItem {
  id?: string
  mn: string
  en: string
  style?: TextStyle
}

interface LocalizedListEditorProps {
  title: string
  editLang: 'mn' | 'en'
  items: LocalizedItem[]
  onChange: (items: LocalizedItem[]) => void
  addButtonLabel?: { mn: string; en: string }
  inputLabel?: { mn: string; en: string }
  showStyling?: boolean
}

export default function LocalizedListEditor({
  title,
  editLang,
  items = [],
  onChange,
  addButtonLabel = { mn: 'Нэмэх', en: 'Add' },
  inputLabel = { mn: 'Текст', en: 'Text' },
  showStyling = false,
}: LocalizedListEditorProps) {
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...(items || [])]
    newItems[index] = { ...newItems[index], [editLang]: value }
    onChange(newItems)
  }

  const handleStyleChange = (index: number, styleKey: keyof TextStyle, value: string) => {
    const newItems = [...(items || [])]
    newItems[index] = {
      ...newItems[index],
      style: { ...newItems[index].style, [styleKey]: value }
    }
    onChange(newItems)
  }

  const handleDelete = (index: number) => {
    const newItems = (items || []).filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleAdd = () => {
    const newItem: LocalizedItem = {
      id: crypto.randomUUID(),
      mn: '',
      en: '',
    }
    onChange([...(items || []), newItem])
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {showStyling && (
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500 hover:text-gray-700 font-medium">ℹ️ Стилинг</summary>
            <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-gray-600 space-y-2">
              <p><strong>Size / Хэмжээ:</strong> Текстийн хэмжээг өөрчлөнө (Small, Normal, Large, X-Large)</p>
              <p><strong>Color / Өнгө:</strong> Текстийн өнгийг сонгоно (Color picker ашигла)</p>
              <p><strong>Font / Фонт:</strong> Текстийн фонтын төрлийг өөрчлөнө (Serif, Sans Serif, Monospace)</p>
              <p><strong>Weight / Жин:</strong> Текстийн хүчтэй байдлыг өөрчлөнө (Normal, Semi-Bold, Bold, Extra Bold)</p>
            </div>
          </details>
        )}
      </div>
      <div className="space-y-3">
        {(items || []).map((item, index) => (
          <div key={item.id || `item-${index}`} className="relative group">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label={editLang === 'mn' ? inputLabel.mn : inputLabel.en}
                  value={item[editLang]}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                />
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="mt-6 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition"
                title="Устгах / Delete"
              >
                🗑️
              </button>
            </div>

            {showStyling && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                <div className="grid grid-cols-4 gap-2">
                  <select
                    value={item.style?.fontSize || ''}
                    onChange={(e) => handleStyleChange(index, 'fontSize', e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                    title="Size / Хэмжээ"
                  >
                    <option value="">Size</option>
                    <option value="text-sm">Small / Жижиг</option>
                    <option value="text-base">Normal / Ердийн</option>
                    <option value="text-lg">Large / Том</option>
                    <option value="text-xl">X-Large / Маш том</option>
                  </select>

                  <input
                    type="color"
                    value={item.style?.fontColor || '#000000'}
                    onChange={(e) => handleStyleChange(index, 'fontColor', e.target.value)}
                    className="h-8 border border-gray-300 rounded cursor-pointer"
                    title="Color / Өнгө"
                  />

                  <select
                    value={item.style?.fontFamily || ''}
                    onChange={(e) => handleStyleChange(index, 'fontFamily', e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                    title="Font / Фонт"
                  >
                    <option value="">Font</option>
                    <option value="serif">Serif</option>
                    <option value="sans-serif">Sans Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>

                  <select
                    value={item.style?.fontWeight || ''}
                    onChange={(e) => handleStyleChange(index, 'fontWeight', e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                    title="Weight (Жин) - Font ийн хүчтэй байдал / Font thickness"
                  >
                    <option value="">Weight</option>
                    <option value="400">Normal / Энгийн</option>
                    <option value="600">Semi-Bold / Хагас</option>
                    <option value="700">Bold / Сүүл</option>
                    <option value="800">Extra Bold / Маш сүүл</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
        <Button onClick={handleAdd}>
          + {editLang === 'mn' ? addButtonLabel.mn : addButtonLabel.en}
        </Button>
      </div>
    </div>
  )
}
