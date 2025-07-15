import {useId} from 'react'
import { FileText, X } from 'lucide-react'

function FileIconManual({name, onRemove, className =''}) {

    const uniqueId = useId(); 
    
  return (
      
        <div className={`flex items-center gap-2 ${className}`}>
                    
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg">
            <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
            
            <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
              {name.trim()}
            </span>

            <button
              onClick={onRemove}
              className="p-0.5 rounded-full hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
        </div>
     
    )
}

export default FileIconManual