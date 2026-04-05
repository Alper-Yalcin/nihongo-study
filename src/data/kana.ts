import { Character, DrawingData, KanaGroup, KanaSection } from '../types';
import { generatedKanaDrawingGuides } from './generatedKanaDrawingGuides';

const drawingGuideLibrary: Record<string, DrawingData> = {
  'h-ka': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 72, labelY: 70, arrowFrom: { x: 84, y: 82 }, arrowTo: { x: 90, y: 154 }, color: '#ef4444' },
      { index: 2, labelX: 114, labelY: 96, arrowFrom: { x: 128, y: 100 }, arrowTo: { x: 190, y: 100 }, color: '#3b82f6' },
      { index: 3, labelX: 222, labelY: 108, arrowFrom: { x: 238, y: 118 }, arrowTo: { x: 212, y: 158 }, color: '#10b981' }
    ]
  },
  'h-ki': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 66, labelY: 70, arrowFrom: { x: 82, y: 70 }, arrowTo: { x: 180, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 86, labelY: 118, arrowFrom: { x: 102, y: 118 }, arrowTo: { x: 216, y: 118 }, color: '#3b82f6' },
      { index: 3, labelX: 150, labelY: 94, arrowFrom: { x: 160, y: 102 }, arrowTo: { x: 162, y: 188 }, color: '#10b981' },
      { index: 4, labelX: 208, labelY: 168, arrowFrom: { x: 224, y: 174 }, arrowTo: { x: 188, y: 208 }, color: '#f59e0b' }
    ]
  },
  'h-ku': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 204, labelY: 84, arrowFrom: { x: 220, y: 92 }, arrowTo: { x: 134, y: 170 }, color: '#ef4444' }
    ]
  },
  'h-ke': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 72, labelY: 70, arrowFrom: { x: 84, y: 82 }, arrowTo: { x: 90, y: 152 }, color: '#ef4444' },
      { index: 2, labelX: 130, labelY: 96, arrowFrom: { x: 142, y: 100 }, arrowTo: { x: 182, y: 108 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 78, arrowFrom: { x: 214, y: 90 }, arrowTo: { x: 214, y: 202 }, color: '#10b981' }
    ]
  },
  'h-ko': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 74, labelY: 84, arrowFrom: { x: 90, y: 84 }, arrowTo: { x: 198, y: 84 }, color: '#ef4444' },
      { index: 2, labelX: 68, labelY: 176, arrowFrom: { x: 88, y: 182 }, arrowTo: { x: 206, y: 182 }, color: '#3b82f6' }
    ]
  },
  'h-sa': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 78, labelY: 74, arrowFrom: { x: 94, y: 74 }, arrowTo: { x: 168, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 118, labelY: 44, arrowFrom: { x: 128, y: 56 }, arrowTo: { x: 128, y: 138 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 110, arrowFrom: { x: 222, y: 118 }, arrowTo: { x: 196, y: 190 }, color: '#10b981' }
    ]
  },
  'h-shi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 198, labelY: 66, arrowFrom: { x: 214, y: 74 }, arrowTo: { x: 150, y: 212 }, color: '#ef4444' }
    ]
  },
  'h-su': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 110, labelY: 42, arrowFrom: { x: 124, y: 52 }, arrowTo: { x: 154, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 80, labelY: 108, arrowFrom: { x: 98, y: 114 }, arrowTo: { x: 196, y: 124 }, color: '#3b82f6' }
    ]
  },
  'h-se': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 64, labelY: 82, arrowFrom: { x: 82, y: 82 }, arrowTo: { x: 204, y: 82 }, color: '#ef4444' },
      { index: 2, labelX: 136, labelY: 40, arrowFrom: { x: 146, y: 52 }, arrowTo: { x: 146, y: 204 }, color: '#3b82f6' },
      { index: 3, labelX: 78, labelY: 178, arrowFrom: { x: 94, y: 182 }, arrowTo: { x: 214, y: 182 }, color: '#10b981' }
    ]
  },
  'h-so': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 202, labelY: 74, arrowFrom: { x: 218, y: 84 }, arrowTo: { x: 148, y: 202 }, color: '#ef4444' }
    ]
  },
  'h-ta': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 74, labelY: 70, arrowFrom: { x: 90, y: 70 }, arrowTo: { x: 170, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 132, labelY: 42, arrowFrom: { x: 142, y: 54 }, arrowTo: { x: 142, y: 138 }, color: '#3b82f6' },
      { index: 3, labelX: 92, labelY: 150, arrowFrom: { x: 106, y: 154 }, arrowTo: { x: 178, y: 154 }, color: '#10b981' },
      { index: 4, labelX: 222, labelY: 104, arrowFrom: { x: 236, y: 114 }, arrowTo: { x: 196, y: 196 }, color: '#f59e0b' }
    ]
  },
  'h-chi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 140, labelY: 40, arrowFrom: { x: 150, y: 52 }, arrowTo: { x: 150, y: 122 }, color: '#ef4444' },
      { index: 2, labelX: 90, labelY: 126, arrowFrom: { x: 106, y: 134 }, arrowTo: { x: 208, y: 150 }, color: '#3b82f6' }
    ]
  },
  'h-tsu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 196, labelY: 86, arrowFrom: { x: 212, y: 96 }, arrowTo: { x: 122, y: 182 }, color: '#ef4444' }
    ]
  },
  'h-te': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 82, labelY: 72, arrowFrom: { x: 98, y: 74 }, arrowTo: { x: 212, y: 132 }, color: '#ef4444' }
    ]
  },
  'h-to': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 112, labelY: 42, arrowFrom: { x: 122, y: 54 }, arrowTo: { x: 122, y: 116 }, color: '#ef4444' },
      { index: 2, labelX: 166, labelY: 104, arrowFrom: { x: 176, y: 116 }, arrowTo: { x: 154, y: 208 }, color: '#3b82f6' }
    ]
  },
  'h-na': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 78, labelY: 70, arrowFrom: { x: 94, y: 70 }, arrowTo: { x: 176, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 136, labelY: 44, arrowFrom: { x: 146, y: 56 }, arrowTo: { x: 146, y: 136 }, color: '#3b82f6' },
      { index: 3, labelX: 86, labelY: 146, arrowFrom: { x: 102, y: 150 }, arrowTo: { x: 188, y: 150 }, color: '#10b981' },
      { index: 4, labelX: 220, labelY: 112, arrowFrom: { x: 236, y: 122 }, arrowTo: { x: 202, y: 200 }, color: '#f59e0b' }
    ]
  },
  'h-ni': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 86, labelY: 84, arrowFrom: { x: 104, y: 84 }, arrowTo: { x: 220, y: 84 }, color: '#ef4444' },
      { index: 2, labelX: 88, labelY: 146, arrowFrom: { x: 106, y: 146 }, arrowTo: { x: 222, y: 146 }, color: '#3b82f6' },
      { index: 3, labelX: 86, labelY: 206, arrowFrom: { x: 106, y: 206 }, arrowTo: { x: 214, y: 206 }, color: '#10b981' }
    ]
  },
  'h-nu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 100, labelY: 48, arrowFrom: { x: 114, y: 60 }, arrowTo: { x: 144, y: 94 }, color: '#ef4444' },
      { index: 2, labelX: 78, labelY: 118, arrowFrom: { x: 94, y: 124 }, arrowTo: { x: 208, y: 142 }, color: '#3b82f6' }
    ]
  },
  'h-ne': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 74, labelY: 74, arrowFrom: { x: 90, y: 74 }, arrowTo: { x: 170, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 134, labelY: 44, arrowFrom: { x: 144, y: 56 }, arrowTo: { x: 144, y: 136 }, color: '#3b82f6' },
      { index: 3, labelX: 92, labelY: 150, arrowFrom: { x: 108, y: 154 }, arrowTo: { x: 192, y: 154 }, color: '#10b981' },
      { index: 4, labelX: 214, labelY: 110, arrowFrom: { x: 228, y: 120 }, arrowTo: { x: 202, y: 202 }, color: '#f59e0b' }
    ]
  },
  'h-no': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 204, labelY: 74, arrowFrom: { x: 220, y: 84 }, arrowTo: { x: 146, y: 212 }, color: '#ef4444' }
    ]
  },
  'h-ha': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 70, arrowFrom: { x: 102, y: 82 }, arrowTo: { x: 106, y: 202 }, color: '#ef4444' },
      { index: 2, labelX: 188, labelY: 70, arrowFrom: { x: 198, y: 82 }, arrowTo: { x: 202, y: 202 }, color: '#3b82f6' },
      { index: 3, labelX: 72, labelY: 122, arrowFrom: { x: 88, y: 124 }, arrowTo: { x: 218, y: 124 }, color: '#10b981' }
    ]
  },
  'h-hi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 196, labelY: 72, arrowFrom: { x: 212, y: 80 }, arrowTo: { x: 138, y: 214 }, color: '#ef4444' }
    ]
  },
  'h-fu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 116, labelY: 34, arrowFrom: { x: 128, y: 44 }, arrowTo: { x: 154, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 78, labelY: 98, arrowFrom: { x: 94, y: 104 }, arrowTo: { x: 130, y: 138 }, color: '#3b82f6' },
      { index: 3, labelX: 204, labelY: 96, arrowFrom: { x: 220, y: 102 }, arrowTo: { x: 178, y: 142 }, color: '#10b981' },
      { index: 4, labelX: 144, labelY: 150, arrowFrom: { x: 154, y: 162 }, arrowTo: { x: 154, y: 216 }, color: '#f59e0b' }
    ]
  },
  'h-he': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 78, arrowFrom: { x: 106, y: 82 }, arrowTo: { x: 214, y: 194 }, color: '#ef4444' }
    ]
  },
  'h-ho': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 68, arrowFrom: { x: 100, y: 80 }, arrowTo: { x: 104, y: 208 }, color: '#ef4444' },
      { index: 2, labelX: 192, labelY: 68, arrowFrom: { x: 202, y: 80 }, arrowTo: { x: 206, y: 208 }, color: '#3b82f6' },
      { index: 3, labelX: 74, labelY: 122, arrowFrom: { x: 90, y: 124 }, arrowTo: { x: 220, y: 124 }, color: '#10b981' },
      { index: 4, labelX: 74, labelY: 186, arrowFrom: { x: 90, y: 188 }, arrowTo: { x: 220, y: 188 }, color: '#f59e0b' }
    ]
  },
  'h-ma': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 86, labelY: 72, arrowFrom: { x: 100, y: 72 }, arrowTo: { x: 184, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 142, labelY: 46, arrowFrom: { x: 152, y: 58 }, arrowTo: { x: 152, y: 144 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 108, arrowFrom: { x: 220, y: 118 }, arrowTo: { x: 188, y: 206 }, color: '#10b981' }
    ]
  },
  'h-mi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 104, labelY: 48, arrowFrom: { x: 118, y: 60 }, arrowTo: { x: 150, y: 92 }, color: '#ef4444' },
      { index: 2, labelX: 80, labelY: 118, arrowFrom: { x: 96, y: 124 }, arrowTo: { x: 214, y: 146 }, color: '#3b82f6' }
    ]
  },
  'h-mu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 72, arrowFrom: { x: 104, y: 72 }, arrowTo: { x: 186, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 148, labelY: 48, arrowFrom: { x: 158, y: 60 }, arrowTo: { x: 158, y: 148 }, color: '#3b82f6' },
      { index: 3, labelX: 214, labelY: 112, arrowFrom: { x: 228, y: 122 }, arrowTo: { x: 196, y: 212 }, color: '#10b981' }
    ]
  },
  'h-me': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 94, labelY: 72, arrowFrom: { x: 110, y: 74 }, arrowTo: { x: 206, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 194, labelY: 108, arrowFrom: { x: 208, y: 120 }, arrowTo: { x: 154, y: 212 }, color: '#3b82f6' }
    ]
  },
  'h-mo': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 74, arrowFrom: { x: 102, y: 74 }, arrowTo: { x: 182, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 144, labelY: 48, arrowFrom: { x: 154, y: 60 }, arrowTo: { x: 154, y: 144 }, color: '#3b82f6' },
      { index: 3, labelX: 86, labelY: 176, arrowFrom: { x: 102, y: 178 }, arrowTo: { x: 214, y: 178 }, color: '#10b981' }
    ]
  },
  'h-ya': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 72, arrowFrom: { x: 102, y: 72 }, arrowTo: { x: 180, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 146, labelY: 48, arrowFrom: { x: 156, y: 60 }, arrowTo: { x: 156, y: 134 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 106, arrowFrom: { x: 220, y: 116 }, arrowTo: { x: 186, y: 206 }, color: '#10b981' }
    ]
  },
  'h-yu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 104, labelY: 44, arrowFrom: { x: 118, y: 56 }, arrowTo: { x: 150, y: 94 }, color: '#ef4444' },
      { index: 2, labelX: 82, labelY: 116, arrowFrom: { x: 98, y: 122 }, arrowTo: { x: 212, y: 146 }, color: '#3b82f6' }
    ]
  },
  'h-yo': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 74, arrowFrom: { x: 102, y: 74 }, arrowTo: { x: 188, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 146, labelY: 48, arrowFrom: { x: 156, y: 60 }, arrowTo: { x: 156, y: 210 }, color: '#3b82f6' }
    ]
  },
  'h-wa': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 98, labelY: 48, arrowFrom: { x: 112, y: 60 }, arrowTo: { x: 146, y: 96 }, color: '#ef4444' },
      { index: 2, labelX: 82, labelY: 118, arrowFrom: { x: 98, y: 124 }, arrowTo: { x: 214, y: 146 }, color: '#3b82f6' }
    ]
  },
  'h-wo': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 82, labelY: 72, arrowFrom: { x: 96, y: 72 }, arrowTo: { x: 174, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 140, labelY: 46, arrowFrom: { x: 150, y: 58 }, arrowTo: { x: 150, y: 136 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 108, arrowFrom: { x: 220, y: 118 }, arrowTo: { x: 188, y: 206 }, color: '#10b981' }
    ]
  },
  'h-ra': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 104, labelY: 44, arrowFrom: { x: 118, y: 56 }, arrowTo: { x: 150, y: 88 }, color: '#ef4444' },
      { index: 2, labelX: 82, labelY: 116, arrowFrom: { x: 98, y: 122 }, arrowTo: { x: 210, y: 144 }, color: '#3b82f6' }
    ]
  },
  'h-ri': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 96, labelY: 72, arrowFrom: { x: 108, y: 84 }, arrowTo: { x: 114, y: 202 }, color: '#ef4444' },
      { index: 2, labelX: 192, labelY: 72, arrowFrom: { x: 204, y: 84 }, arrowTo: { x: 210, y: 202 }, color: '#3b82f6' }
    ]
  },
  'h-ru': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 198, labelY: 76, arrowFrom: { x: 214, y: 86 }, arrowTo: { x: 146, y: 214 }, color: '#ef4444' }
    ]
  },
  'h-re': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 78, arrowFrom: { x: 104, y: 80 }, arrowTo: { x: 214, y: 194 }, color: '#ef4444' }
    ]
  },
  'h-ro': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 86, labelY: 74, arrowFrom: { x: 100, y: 74 }, arrowTo: { x: 184, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 144, labelY: 48, arrowFrom: { x: 154, y: 60 }, arrowTo: { x: 154, y: 142 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 110, arrowFrom: { x: 220, y: 120 }, arrowTo: { x: 188, y: 206 }, color: '#10b981' }
    ]
  },
  'k-a': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 60, labelY: 58, arrowFrom: { x: 78, y: 52 }, arrowTo: { x: 154, y: 52 }, color: '#ef4444' },
      { index: 2, labelX: 132, labelY: 104, arrowFrom: { x: 142, y: 116 }, arrowTo: { x: 142, y: 184 }, color: '#3b82f6' }
    ]
  },
  'k-i': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 178, labelY: 36, arrowFrom: { x: 190, y: 46 }, arrowTo: { x: 152, y: 118 }, color: '#ef4444' },
      { index: 2, labelX: 214, labelY: 104, arrowFrom: { x: 224, y: 118 }, arrowTo: { x: 224, y: 196 }, color: '#3b82f6' }
    ]
  },
  'k-u': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 138, labelY: 24, arrowFrom: { x: 150, y: 34 }, arrowTo: { x: 150, y: 60 }, color: '#ef4444' },
      { index: 2, labelX: 70, labelY: 92, arrowFrom: { x: 88, y: 96 }, arrowTo: { x: 154, y: 96 }, color: '#3b82f6' },
      { index: 3, labelX: 194, labelY: 122, arrowFrom: { x: 204, y: 136 }, arrowTo: { x: 204, y: 208 }, color: '#10b981' }
    ]
  },
  'k-e': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 60, labelY: 56, arrowFrom: { x: 78, y: 50 }, arrowTo: { x: 156, y: 50 }, color: '#ef4444' },
      { index: 2, labelX: 122, labelY: 84, arrowFrom: { x: 132, y: 96 }, arrowTo: { x: 132, y: 176 }, color: '#3b82f6' },
      { index: 3, labelX: 60, labelY: 222, arrowFrom: { x: 80, y: 214 }, arrowTo: { x: 162, y: 214 }, color: '#10b981' }
    ]
  },
  'k-o': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 48, labelY: 46, arrowFrom: { x: 64, y: 46 }, arrowTo: { x: 132, y: 46 }, color: '#ef4444' },
      { index: 2, labelX: 106, labelY: 76, arrowFrom: { x: 118, y: 88 }, arrowTo: { x: 118, y: 158 }, color: '#3b82f6' },
      { index: 3, labelX: 64, labelY: 112, arrowFrom: { x: 80, y: 124 }, arrowTo: { x: 60, y: 170 }, color: '#10b981' }
    ]
  },
  'k-ka': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 70, labelY: 74, arrowFrom: { x: 86, y: 70 }, arrowTo: { x: 156, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 164, labelY: 90, arrowFrom: { x: 174, y: 102 }, arrowTo: { x: 162, y: 208 }, color: '#3b82f6' }
    ]
  },
  'k-ki': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 72, labelY: 74, arrowFrom: { x: 88, y: 74 }, arrowTo: { x: 188, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 96, labelY: 122, arrowFrom: { x: 112, y: 124 }, arrowTo: { x: 226, y: 128 }, color: '#3b82f6' },
      { index: 3, labelX: 212, labelY: 84, arrowFrom: { x: 222, y: 96 }, arrowTo: { x: 146, y: 214 }, color: '#10b981' }
    ]
  },
  'k-ku': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 198, labelY: 82, arrowFrom: { x: 214, y: 92 }, arrowTo: { x: 130, y: 174 }, color: '#ef4444' }
    ]
  },
  'k-ke': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 92, labelY: 70, arrowFrom: { x: 104, y: 80 }, arrowTo: { x: 146, y: 80 }, color: '#ef4444' },
      { index: 2, labelX: 150, labelY: 88, arrowFrom: { x: 160, y: 100 }, arrowTo: { x: 154, y: 206 }, color: '#3b82f6' },
      { index: 3, labelX: 78, labelY: 192, arrowFrom: { x: 94, y: 194 }, arrowTo: { x: 214, y: 194 }, color: '#10b981' }
    ]
  },
  'k-ko': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 74, labelY: 84, arrowFrom: { x: 90, y: 84 }, arrowTo: { x: 210, y: 84 }, color: '#ef4444' },
      { index: 2, labelX: 74, labelY: 186, arrowFrom: { x: 90, y: 186 }, arrowTo: { x: 214, y: 186 }, color: '#3b82f6' }
    ]
  },
  'k-sa': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 76, labelY: 74, arrowFrom: { x: 92, y: 74 }, arrowTo: { x: 170, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 132, labelY: 56, arrowFrom: { x: 142, y: 68 }, arrowTo: { x: 142, y: 142 }, color: '#3b82f6' },
      { index: 3, labelX: 206, labelY: 114, arrowFrom: { x: 216, y: 124 }, arrowTo: { x: 188, y: 204 }, color: '#10b981' }
    ]
  },
  'k-shi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 54, arrowFrom: { x: 96, y: 66 }, arrowTo: { x: 120, y: 112 }, color: '#ef4444' },
      { index: 2, labelX: 144, labelY: 82, arrowFrom: { x: 152, y: 94 }, arrowTo: { x: 176, y: 142 }, color: '#3b82f6' },
      { index: 3, labelX: 210, labelY: 64, arrowFrom: { x: 220, y: 76 }, arrowTo: { x: 154, y: 214 }, color: '#10b981' }
    ]
  },
  'k-su': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 128, labelY: 40, arrowFrom: { x: 140, y: 52 }, arrowTo: { x: 166, y: 94 }, color: '#ef4444' },
      { index: 2, labelX: 206, labelY: 106, arrowFrom: { x: 218, y: 116 }, arrowTo: { x: 150, y: 208 }, color: '#3b82f6' }
    ]
  },
  'k-se': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 98, labelY: 72, arrowFrom: { x: 112, y: 84 }, arrowTo: { x: 112, y: 202 }, color: '#ef4444' },
      { index: 2, labelX: 62, labelY: 134, arrowFrom: { x: 80, y: 136 }, arrowTo: { x: 220, y: 136 }, color: '#3b82f6' }
    ]
  },
  'k-so': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 94, labelY: 56, arrowFrom: { x: 102, y: 68 }, arrowTo: { x: 124, y: 110 }, color: '#ef4444' },
      { index: 2, labelX: 210, labelY: 70, arrowFrom: { x: 220, y: 82 }, arrowTo: { x: 156, y: 208 }, color: '#3b82f6' }
    ]
  },
  'k-ta': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 78, labelY: 68, arrowFrom: { x: 94, y: 68 }, arrowTo: { x: 188, y: 68 }, color: '#ef4444' },
      { index: 2, labelX: 208, labelY: 78, arrowFrom: { x: 218, y: 90 }, arrowTo: { x: 180, y: 140 }, color: '#3b82f6' },
      { index: 3, labelX: 92, labelY: 184, arrowFrom: { x: 106, y: 186 }, arrowTo: { x: 206, y: 186 }, color: '#10b981' }
    ]
  },
  'k-chi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 78, labelY: 58, arrowFrom: { x: 92, y: 58 }, arrowTo: { x: 176, y: 58 }, color: '#ef4444' },
      { index: 2, labelX: 138, labelY: 90, arrowFrom: { x: 148, y: 102 }, arrowTo: { x: 148, y: 150 }, color: '#3b82f6' },
      { index: 3, labelX: 82, labelY: 176, arrowFrom: { x: 98, y: 180 }, arrowTo: { x: 214, y: 180 }, color: '#10b981' }
    ]
  },
  'k-tsu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 94, labelY: 54, arrowFrom: { x: 102, y: 66 }, arrowTo: { x: 124, y: 112 }, color: '#ef4444' },
      { index: 2, labelX: 150, labelY: 86, arrowFrom: { x: 158, y: 98 }, arrowTo: { x: 182, y: 146 }, color: '#3b82f6' },
      { index: 3, labelX: 208, labelY: 60, arrowFrom: { x: 218, y: 72 }, arrowTo: { x: 152, y: 212 }, color: '#10b981' }
    ]
  },
  'k-te': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 76, labelY: 66, arrowFrom: { x: 92, y: 66 }, arrowTo: { x: 188, y: 66 }, color: '#ef4444' },
      { index: 2, labelX: 146, labelY: 94, arrowFrom: { x: 156, y: 106 }, arrowTo: { x: 156, y: 150 }, color: '#3b82f6' },
      { index: 3, labelX: 74, labelY: 188, arrowFrom: { x: 92, y: 188 }, arrowTo: { x: 216, y: 188 }, color: '#10b981' }
    ]
  },
  'k-to': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 138, labelY: 44, arrowFrom: { x: 148, y: 56 }, arrowTo: { x: 148, y: 120 }, color: '#ef4444' },
      { index: 2, labelX: 166, labelY: 100, arrowFrom: { x: 176, y: 112 }, arrowTo: { x: 156, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-na': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 80, arrowFrom: { x: 108, y: 80 }, arrowTo: { x: 214, y: 80 }, color: '#ef4444' },
      { index: 2, labelX: 150, labelY: 44, arrowFrom: { x: 160, y: 56 }, arrowTo: { x: 160, y: 206 }, color: '#3b82f6' }
    ]
  },
  'k-ni': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 82, labelY: 90, arrowFrom: { x: 100, y: 90 }, arrowTo: { x: 216, y: 90 }, color: '#ef4444' },
      { index: 2, labelX: 82, labelY: 186, arrowFrom: { x: 100, y: 186 }, arrowTo: { x: 218, y: 186 }, color: '#3b82f6' }
    ]
  },
  'k-nu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 208, labelY: 70, arrowFrom: { x: 224, y: 82 }, arrowTo: { x: 146, y: 212 }, color: '#ef4444' }
    ]
  },
  'k-ne': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 78, labelY: 70, arrowFrom: { x: 94, y: 70 }, arrowTo: { x: 174, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 136, labelY: 46, arrowFrom: { x: 146, y: 58 }, arrowTo: { x: 146, y: 140 }, color: '#3b82f6' },
      { index: 3, labelX: 92, labelY: 150, arrowFrom: { x: 108, y: 154 }, arrowTo: { x: 194, y: 154 }, color: '#10b981' },
      { index: 4, labelX: 218, labelY: 114, arrowFrom: { x: 232, y: 124 }, arrowTo: { x: 202, y: 206 }, color: '#f59e0b' }
    ]
  },
  'k-no': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 202, labelY: 70, arrowFrom: { x: 218, y: 82 }, arrowTo: { x: 142, y: 214 }, color: '#ef4444' }
    ]
  },
  'k-ha': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 92, labelY: 74, arrowFrom: { x: 102, y: 86 }, arrowTo: { x: 130, y: 210 }, color: '#ef4444' },
      { index: 2, labelX: 194, labelY: 74, arrowFrom: { x: 204, y: 86 }, arrowTo: { x: 174, y: 210 }, color: '#3b82f6' }
    ]
  },
  'k-hi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 72, arrowFrom: { x: 100, y: 72 }, arrowTo: { x: 208, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 204, labelY: 102, arrowFrom: { x: 214, y: 114 }, arrowTo: { x: 154, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-fu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 206, labelY: 74, arrowFrom: { x: 220, y: 86 }, arrowTo: { x: 146, y: 214 }, color: '#ef4444' }
    ]
  },
  'k-he': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 94, labelY: 78, arrowFrom: { x: 110, y: 82 }, arrowTo: { x: 214, y: 194 }, color: '#ef4444' }
    ]
  },
  'k-ho': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 4,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 68, arrowFrom: { x: 100, y: 80 }, arrowTo: { x: 104, y: 210 }, color: '#ef4444' },
      { index: 2, labelX: 194, labelY: 68, arrowFrom: { x: 206, y: 80 }, arrowTo: { x: 208, y: 210 }, color: '#3b82f6' },
      { index: 3, labelX: 74, labelY: 124, arrowFrom: { x: 90, y: 126 }, arrowTo: { x: 220, y: 126 }, color: '#10b981' },
      { index: 4, labelX: 74, labelY: 190, arrowFrom: { x: 90, y: 192 }, arrowTo: { x: 220, y: 192 }, color: '#f59e0b' }
    ]
  },
  'k-ma': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 86, labelY: 74, arrowFrom: { x: 100, y: 74 }, arrowTo: { x: 212, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 146, labelY: 44, arrowFrom: { x: 156, y: 56 }, arrowTo: { x: 156, y: 210 }, color: '#3b82f6' }
    ]
  },
  'k-mi': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 82, labelY: 70, arrowFrom: { x: 96, y: 70 }, arrowTo: { x: 190, y: 70 }, color: '#ef4444' },
      { index: 2, labelX: 82, labelY: 134, arrowFrom: { x: 98, y: 134 }, arrowTo: { x: 192, y: 134 }, color: '#3b82f6' },
      { index: 3, labelX: 82, labelY: 196, arrowFrom: { x: 98, y: 196 }, arrowTo: { x: 192, y: 196 }, color: '#10b981' }
    ]
  },
  'k-mu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 78, arrowFrom: { x: 104, y: 78 }, arrowTo: { x: 216, y: 78 }, color: '#ef4444' },
      { index: 2, labelX: 204, labelY: 112, arrowFrom: { x: 216, y: 124 }, arrowTo: { x: 146, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-me': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 72, arrowFrom: { x: 102, y: 72 }, arrowTo: { x: 190, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 202, labelY: 104, arrowFrom: { x: 214, y: 116 }, arrowTo: { x: 154, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-mo': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 82, labelY: 72, arrowFrom: { x: 96, y: 72 }, arrowTo: { x: 188, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 82, labelY: 134, arrowFrom: { x: 98, y: 134 }, arrowTo: { x: 190, y: 134 }, color: '#3b82f6' },
      { index: 3, labelX: 82, labelY: 196, arrowFrom: { x: 98, y: 196 }, arrowTo: { x: 190, y: 196 }, color: '#10b981' }
    ]
  },
  'k-ya': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 74, arrowFrom: { x: 104, y: 74 }, arrowTo: { x: 198, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 200, labelY: 104, arrowFrom: { x: 212, y: 116 }, arrowTo: { x: 154, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-yu': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 88, labelY: 72, arrowFrom: { x: 102, y: 72 }, arrowTo: { x: 196, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 144, labelY: 46, arrowFrom: { x: 154, y: 58 }, arrowTo: { x: 154, y: 210 }, color: '#3b82f6' }
    ]
  },
  'k-yo': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 84, labelY: 72, arrowFrom: { x: 98, y: 72 }, arrowTo: { x: 186, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 84, labelY: 134, arrowFrom: { x: 98, y: 134 }, arrowTo: { x: 186, y: 134 }, color: '#3b82f6' },
      { index: 3, labelX: 84, labelY: 196, arrowFrom: { x: 98, y: 196 }, arrowTo: { x: 186, y: 196 }, color: '#10b981' }
    ]
  },
  'k-wa': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 84, labelY: 72, arrowFrom: { x: 98, y: 72 }, arrowTo: { x: 188, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 198, labelY: 102, arrowFrom: { x: 210, y: 114 }, arrowTo: { x: 154, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-wo': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 84, labelY: 72, arrowFrom: { x: 98, y: 72 }, arrowTo: { x: 182, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 142, labelY: 48, arrowFrom: { x: 152, y: 60 }, arrowTo: { x: 152, y: 138 }, color: '#3b82f6' },
      { index: 3, labelX: 204, labelY: 110, arrowFrom: { x: 218, y: 120 }, arrowTo: { x: 188, y: 208 }, color: '#10b981' }
    ]
  },
  'k-ra': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 96, labelY: 72, arrowFrom: { x: 110, y: 72 }, arrowTo: { x: 198, y: 72 }, color: '#ef4444' },
      { index: 2, labelX: 202, labelY: 102, arrowFrom: { x: 214, y: 114 }, arrowTo: { x: 154, y: 214 }, color: '#3b82f6' }
    ]
  },
  'k-ri': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 2,
    strokeGuides: [
      { index: 1, labelX: 98, labelY: 80, arrowFrom: { x: 110, y: 92 }, arrowTo: { x: 116, y: 204 }, color: '#ef4444' },
      { index: 2, labelX: 194, labelY: 80, arrowFrom: { x: 206, y: 92 }, arrowTo: { x: 212, y: 204 }, color: '#3b82f6' }
    ]
  },
  'k-ru': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 196, labelY: 74, arrowFrom: { x: 210, y: 86 }, arrowTo: { x: 144, y: 214 }, color: '#ef4444' }
    ]
  },
  'k-re': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 1,
    strokeGuides: [
      { index: 1, labelX: 90, labelY: 78, arrowFrom: { x: 106, y: 82 }, arrowTo: { x: 214, y: 194 }, color: '#ef4444' }
    ]
  },
  'k-ro': {
    viewBoxWidth: 300,
    viewBoxHeight: 300,
    strokeCount: 3,
    strokeGuides: [
      { index: 1, labelX: 84, labelY: 74, arrowFrom: { x: 98, y: 74 }, arrowTo: { x: 182, y: 74 }, color: '#ef4444' },
      { index: 2, labelX: 142, labelY: 48, arrowFrom: { x: 152, y: 60 }, arrowTo: { x: 152, y: 142 }, color: '#3b82f6' },
      { index: 3, labelX: 204, labelY: 110, arrowFrom: { x: 218, y: 120 }, arrowTo: { x: 188, y: 208 }, color: '#10b981' }
    ]
  }
};

const createDrawingData = (
  strokeGuides: NonNullable<DrawingData['strokeGuides']>,
  guidePaths: NonNullable<DrawingData['guidePaths']> = [],
  viewBoxWidth = 300,
  viewBoxHeight = 300
): DrawingData => ({
  viewBoxWidth,
  viewBoxHeight,
  strokeCount: strokeGuides.length,
  guidePaths,
  strokeGuides
});

const transformDrawingData = (
  drawingData: DrawingData,
  {
    scale = 1,
    translateX = 0,
    translateY = 0
  }: {
    scale?: number;
    translateX?: number;
    translateY?: number;
  } = {}
): DrawingData => {
  const transformPrefix = [
    translateX !== 0 || translateY !== 0 ? `translate(${translateX} ${translateY})` : '',
    scale !== 1 ? `scale(${scale})` : ''
  ]
    .filter(Boolean)
    .join(' ');

  return createDrawingData(
    (drawingData.strokeGuides ?? []).map((guide, index) => ({
      ...guide,
      index: index + 1,
      labelX: Math.round(guide.labelX * scale + translateX),
      labelY: Math.round(guide.labelY * scale + translateY),
      arrowFrom: {
        x: Math.round(guide.arrowFrom.x * scale + translateX),
        y: Math.round(guide.arrowFrom.y * scale + translateY)
      },
      arrowTo: {
        x: Math.round(guide.arrowTo.x * scale + translateX),
        y: Math.round(guide.arrowTo.y * scale + translateY)
      }
    })),
    (drawingData.guidePaths ?? []).map((guidePath) => ({
      ...guidePath,
      transform: [transformPrefix, guidePath.transform].filter(Boolean).join(' ') || undefined
    })),
    drawingData.viewBoxWidth ?? 300,
    drawingData.viewBoxHeight ?? 300
  );
};

const composeDrawingData = (...parts: DrawingData[]): DrawingData => {
  const combinedGuides: NonNullable<DrawingData['strokeGuides']> = [];
  const combinedPaths: NonNullable<DrawingData['guidePaths']> = [];
  let nextIndex = 1;

  parts.forEach((part) => {
    (part.strokeGuides ?? []).forEach((guide) => {
      combinedGuides.push({
        ...guide,
        index: nextIndex
      });
      nextIndex += 1;
    });

    (part.guidePaths ?? []).forEach((guidePath) => {
      combinedPaths.push(guidePath);
    });
  });

  return createDrawingData(
    combinedGuides,
    combinedPaths,
    parts[0]?.viewBoxWidth ?? 300,
    parts[0]?.viewBoxHeight ?? 300
  );
};

const roundScaledValue = (value: number) => Math.round(value * 1000) / 1000;

const scaleStrokeGuides = (
  strokeGuides: DrawingData['strokeGuides'],
  scaleX: number,
  scaleY: number,
  maxCount?: number
): DrawingData['strokeGuides'] =>
  strokeGuides
    ?.slice(0, maxCount)
    .map((guide, index) => ({
      ...guide,
      index: index + 1,
      labelX: Math.round(guide.labelX * scaleX),
      labelY: Math.round(guide.labelY * scaleY),
      arrowFrom: {
        x: Math.round(guide.arrowFrom.x * scaleX),
        y: Math.round(guide.arrowFrom.y * scaleY)
      },
      arrowTo: {
        x: Math.round(guide.arrowTo.x * scaleX),
        y: Math.round(guide.arrowTo.y * scaleY)
      }
    }));

const scaleGuidePaths = (
  guidePaths: DrawingData['guidePaths'],
  scaleX: number,
  scaleY: number,
  maxCount?: number
): DrawingData['guidePaths'] => {
  const trimmedGuidePaths = guidePaths?.slice(0, maxCount);

  if (!trimmedGuidePaths?.length) {
    return trimmedGuidePaths;
  }

  if (Math.abs(scaleX - 1) < 0.0001 && Math.abs(scaleY - 1) < 0.0001) {
    return trimmedGuidePaths;
  }

  const scaleTransform =
    Math.abs(scaleX - scaleY) < 0.0001
      ? `scale(${roundScaledValue(scaleX)})`
      : `scale(${roundScaledValue(scaleX)} ${roundScaledValue(scaleY)})`;

  return trimmedGuidePaths.map((guidePath) => ({
    ...guidePath,
    transform: [scaleTransform, guidePath.transform].filter(Boolean).join(' ') || undefined
  }));
};

const scaleSafeZone = (
  safeZone: DrawingData['safeZone'],
  scaleX: number,
  scaleY: number
): DrawingData['safeZone'] =>
  safeZone
    ? {
        x: Math.round(safeZone.x * scaleX),
        y: Math.round(safeZone.y * scaleY),
        width: Math.round(safeZone.width * scaleX),
        height: Math.round(safeZone.height * scaleY)
      }
    : undefined;

const parseGuidePathStart = (d: string) => {
  const match = d.match(/^[\s,]*([Mm])\s*([+-]?\d*\.?\d+)\s*[ ,]\s*([+-]?\d*\.?\d+)/);

  if (!match) {
    return null;
  }

  return {
    x: Number(match[2]),
    y: Number(match[3])
  };
};

type Matrix = [number, number, number, number, number, number];

const identityMatrix = (): Matrix => [1, 0, 0, 1, 0, 0];

const multiplyMatrices = (left: Matrix, right: Matrix): Matrix => [
  left[0] * right[0] + left[2] * right[1],
  left[1] * right[0] + left[3] * right[1],
  left[0] * right[2] + left[2] * right[3],
  left[1] * right[2] + left[3] * right[3],
  left[0] * right[4] + left[2] * right[5] + left[4],
  left[1] * right[4] + left[3] * right[5] + left[5]
];

const applyGuidePathTransform = (
  point: { x: number; y: number },
  transform?: string
) => {
  if (!transform) {
    return point;
  }

  let matrix = identityMatrix();
  const matcher = /(translate|scale)\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(transform)) !== null) {
    const [, type, rawArgs] = match;
    const args = rawArgs
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);

    if (type === 'translate') {
      matrix = multiplyMatrices(matrix, [1, 0, 0, 1, args[0] ?? 0, args[1] ?? 0]);
      continue;
    }

    const scaleX = args[0] ?? 1;
    const scaleY = args[1] ?? scaleX;
    matrix = multiplyMatrices(matrix, [scaleX, 0, 0, scaleY, 0, 0]);
  }

  return {
    x: point.x * matrix[0] + point.y * matrix[2] + matrix[4],
    y: point.x * matrix[1] + point.y * matrix[3] + matrix[5]
  };
};

const alignGuidePathsToStrokeGuides = (drawingData: DrawingData): DrawingData => {
  if (!drawingData.guidePaths?.length || !drawingData.strokeGuides?.length) {
    return drawingData;
  }

  const alignedGuidePaths = drawingData.guidePaths.map((guidePath, index) => {
    const strokeGuide = drawingData.strokeGuides?.[index];
    const startPoint = parseGuidePathStart(guidePath.d);

    if (!strokeGuide || !startPoint) {
      return guidePath;
    }

    const transformedStart = applyGuidePathTransform(startPoint, guidePath.transform);
    const deltaX = strokeGuide.arrowFrom.x - transformedStart.x;
    const deltaY = strokeGuide.arrowFrom.y - transformedStart.y;

    if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) {
      return guidePath;
    }

    return {
      ...guidePath,
      transform: [
        `translate(${roundScaledValue(deltaX)} ${roundScaledValue(deltaY)})`,
        guidePath.transform
      ]
        .filter(Boolean)
        .join(' ')
    };
  });

  return {
    ...drawingData,
    guidePaths: alignedGuidePaths
  };
};

const normalizeDrawingDataForDisplay = (drawingData: DrawingData): DrawingData => {
  const viewBoxWidth = drawingData.viewBoxWidth ?? 300;
  const viewBoxHeight = drawingData.viewBoxHeight ?? 300;
  const clampToViewBox = (value: number, max: number) => Math.min(Math.max(value, 0), max);

  return alignGuidePathsToStrokeGuides({
    ...drawingData,
    strokeGuides: drawingData.strokeGuides?.map((guide, index) => ({
      ...guide,
      index: index + 1,
      labelX: clampToViewBox(guide.labelX, viewBoxWidth),
      labelY: clampToViewBox(guide.labelY, viewBoxHeight),
      arrowFrom: {
        x: clampToViewBox(guide.arrowFrom.x, viewBoxWidth),
        y: clampToViewBox(guide.arrowFrom.y, viewBoxHeight)
      },
      arrowTo: {
        x: clampToViewBox(guide.arrowTo.x, viewBoxWidth),
        y: clampToViewBox(guide.arrowTo.y, viewBoxHeight)
      }
    }))
  });
};

const mergeCharacterDrawingData = (
  inlineDrawingData: DrawingData,
  fallbackDrawingData?: DrawingData
): DrawingData => {
  if (!fallbackDrawingData) {
    return normalizeDrawingDataForDisplay(inlineDrawingData);
  }

  const targetViewBoxWidth = inlineDrawingData.viewBoxWidth ?? fallbackDrawingData.viewBoxWidth ?? 300;
  const targetViewBoxHeight = inlineDrawingData.viewBoxHeight ?? fallbackDrawingData.viewBoxHeight ?? 300;
  const sourceViewBoxWidth = fallbackDrawingData.viewBoxWidth ?? targetViewBoxWidth;
  const sourceViewBoxHeight = fallbackDrawingData.viewBoxHeight ?? targetViewBoxHeight;
  const scaleX = targetViewBoxWidth / Math.max(sourceViewBoxWidth, 1);
  const scaleY = targetViewBoxHeight / Math.max(sourceViewBoxHeight, 1);
  const preferredStrokeCount =
    inlineDrawingData.strokeCount ??
    inlineDrawingData.strokeGuides?.length ??
    fallbackDrawingData.strokeCount ??
    fallbackDrawingData.strokeGuides?.length ??
    fallbackDrawingData.guidePaths?.length;

  return normalizeDrawingDataForDisplay({
    ...fallbackDrawingData,
    ...inlineDrawingData,
    viewBoxWidth: targetViewBoxWidth,
    viewBoxHeight: targetViewBoxHeight,
    strokeCount: preferredStrokeCount,
    guidePaths:
      inlineDrawingData.guidePaths?.length
        ? inlineDrawingData.guidePaths
        : scaleGuidePaths(fallbackDrawingData.guidePaths, scaleX, scaleY, preferredStrokeCount),
    strokeGuides:
      inlineDrawingData.strokeGuides?.length
        ? inlineDrawingData.strokeGuides
        : scaleStrokeGuides(fallbackDrawingData.strokeGuides, scaleX, scaleY, preferredStrokeCount),
    safeZone:
      inlineDrawingData.safeZone ??
      scaleSafeZone(fallbackDrawingData.safeZone, scaleX, scaleY)
  });
};

const createDakutenData = (): DrawingData =>
  createDrawingData(
    [
      {
        index: 1,
        labelX: 744,
        labelY: 126,
        arrowFrom: { x: 786, y: 158 },
        arrowTo: { x: 828, y: 246 },
        color: '#a855f7'
      },
      {
        index: 2,
        labelX: 822,
        labelY: 106,
        arrowFrom: { x: 864, y: 138 },
        arrowTo: { x: 906, y: 226 },
        color: '#ec4899'
      }
    ],
    [
      { d: 'M786 158l42 88' },
      { d: 'M864 138l42 88' }
    ],
    1024,
    1024
  );

const createHandakutenData = (): DrawingData =>
  createDrawingData(
    [
      {
        index: 1,
        labelX: 782,
        labelY: 120,
        arrowFrom: { x: 812, y: 160 },
        arrowTo: { x: 886, y: 160 },
        color: '#f97316'
      }
    ],
    [{ d: 'M812 160a38 38 0 1 1 76 0a38 38 0 1 1 -76 0' }],
    1024,
    1024
  );

const COMBINED_MAIN_OFFSET_X = -34;
const COMBINED_SMALL_SCALE = 0.58;
const COMBINED_SMALL_OFFSET_X = 116;
const COMBINED_SMALL_OFFSET_Y = 88;
const COMBINED_VOWEL_SCALE = 0.54;
const COMBINED_VOWEL_OFFSET_X = 122;
const COMBINED_VOWEL_OFFSET_Y = 94;

const createDerivedDrawingGuides = () => {
  const derived: Record<string, DrawingData> = {};

  if (!drawingGuideLibrary['h-n']) {
    derived['h-n'] = createDrawingData([
      {
        index: 1,
        labelX: 198,
        labelY: 78,
        arrowFrom: { x: 214, y: 88 },
        arrowTo: { x: 142, y: 214 },
        color: '#ef4444'
      }
    ]);
  }

  if (!drawingGuideLibrary['k-n']) {
    derived['k-n'] = createDrawingData([
      {
        index: 1,
        labelX: 198,
        labelY: 78,
        arrowFrom: { x: 214, y: 88 },
        arrowTo: { x: 142, y: 214 },
        color: '#ef4444'
      }
    ]);
  }

  const getDrawingData = (id: string) => {
    const drawingData = derived[id] ?? drawingGuideLibrary[id];

    if (!drawingData) {
      throw new Error(`Missing drawing guide source: ${id}`);
    }

    return drawingData;
  };

  const voicedMappings: Array<[string, string, 'dakuten' | 'handakuten']> = [
    ['h-ga', 'h-ka', 'dakuten'],
    ['h-za', 'h-sa', 'dakuten'],
    ['h-da', 'h-ta', 'dakuten'],
    ['h-ba', 'h-ha', 'dakuten'],
    ['h-pa', 'h-ha', 'handakuten'],
    ['h-gi', 'h-ki', 'dakuten'],
    ['h-ji', 'h-shi', 'dakuten'],
    ['h-dji', 'h-chi', 'dakuten'],
    ['h-bi', 'h-hi', 'dakuten'],
    ['h-pi', 'h-hi', 'handakuten'],
    ['h-gu', 'h-ku', 'dakuten'],
    ['h-zu', 'h-su', 'dakuten'],
    ['h-dzu', 'h-tsu', 'dakuten'],
    ['h-bu', 'h-fu', 'dakuten'],
    ['h-pu', 'h-fu', 'handakuten'],
    ['h-ge', 'h-ke', 'dakuten'],
    ['h-ze', 'h-se', 'dakuten'],
    ['h-de', 'h-te', 'dakuten'],
    ['h-be', 'h-he', 'dakuten'],
    ['h-pe', 'h-he', 'handakuten'],
    ['h-go', 'h-ko', 'dakuten'],
    ['h-zo', 'h-so', 'dakuten'],
    ['h-do', 'h-to', 'dakuten'],
    ['h-bo', 'h-ho', 'dakuten'],
    ['h-po', 'h-ho', 'handakuten'],
    ['k-ga', 'k-ka', 'dakuten'],
    ['k-za', 'k-sa', 'dakuten'],
    ['k-da', 'k-ta', 'dakuten'],
    ['k-ba', 'k-ha', 'dakuten'],
    ['k-pa', 'k-ha', 'handakuten'],
    ['k-gi', 'k-ki', 'dakuten'],
    ['k-ji', 'k-shi', 'dakuten'],
    ['k-dji', 'k-chi', 'dakuten'],
    ['k-bi', 'k-hi', 'dakuten'],
    ['k-pi', 'k-hi', 'handakuten'],
    ['k-gu', 'k-ku', 'dakuten'],
    ['k-zu', 'k-su', 'dakuten'],
    ['k-dzu', 'k-tsu', 'dakuten'],
    ['k-bu', 'k-fu', 'dakuten'],
    ['k-pu', 'k-fu', 'handakuten'],
    ['k-ge', 'k-ke', 'dakuten'],
    ['k-ze', 'k-se', 'dakuten'],
    ['k-de', 'k-te', 'dakuten'],
    ['k-be', 'k-he', 'dakuten'],
    ['k-pe', 'k-he', 'handakuten'],
    ['k-go', 'k-ko', 'dakuten'],
    ['k-zo', 'k-so', 'dakuten'],
    ['k-do', 'k-to', 'dakuten'],
    ['k-bo', 'k-ho', 'dakuten'],
    ['k-po', 'k-ho', 'handakuten']
  ];

  voicedMappings.forEach(([targetId, baseId, markType]) => {
    derived[targetId] = composeDrawingData(
      getDrawingData(baseId),
      markType === 'dakuten' ? createDakutenData() : createHandakutenData()
    );
  });

  const yoonMappings: Array<[string, string, string]> = [
    ['h-kya', 'h-ki', 'h-ya'],
    ['h-sha', 'h-shi', 'h-ya'],
    ['h-cha', 'h-chi', 'h-ya'],
    ['h-nya', 'h-ni', 'h-ya'],
    ['h-hya', 'h-hi', 'h-ya'],
    ['h-mya', 'h-mi', 'h-ya'],
    ['h-rya', 'h-ri', 'h-ya'],
    ['h-gya', 'h-gi', 'h-ya'],
    ['h-ja', 'h-ji', 'h-ya'],
    ['h-bya', 'h-bi', 'h-ya'],
    ['h-pya', 'h-pi', 'h-ya'],
    ['h-kyu', 'h-ki', 'h-yu'],
    ['h-shu', 'h-shi', 'h-yu'],
    ['h-chu', 'h-chi', 'h-yu'],
    ['h-nyu', 'h-ni', 'h-yu'],
    ['h-hyu', 'h-hi', 'h-yu'],
    ['h-myu', 'h-mi', 'h-yu'],
    ['h-ryu', 'h-ri', 'h-yu'],
    ['h-gyu', 'h-gi', 'h-yu'],
    ['h-ju', 'h-ji', 'h-yu'],
    ['h-byu', 'h-bi', 'h-yu'],
    ['h-pyu', 'h-pi', 'h-yu'],
    ['h-kyo', 'h-ki', 'h-yo'],
    ['h-sho', 'h-shi', 'h-yo'],
    ['h-cho', 'h-chi', 'h-yo'],
    ['h-nyo', 'h-ni', 'h-yo'],
    ['h-hyo', 'h-hi', 'h-yo'],
    ['h-myo', 'h-mi', 'h-yo'],
    ['h-ryo', 'h-ri', 'h-yo'],
    ['h-gyo', 'h-gi', 'h-yo'],
    ['h-jo', 'h-ji', 'h-yo'],
    ['h-byo', 'h-bi', 'h-yo'],
    ['h-pyo', 'h-pi', 'h-yo'],
    ['k-kya', 'k-ki', 'k-ya'],
    ['k-sha', 'k-shi', 'k-ya'],
    ['k-cha', 'k-chi', 'k-ya'],
    ['k-nya', 'k-ni', 'k-ya'],
    ['k-hya', 'k-hi', 'k-ya'],
    ['k-mya', 'k-mi', 'k-ya'],
    ['k-rya', 'k-ri', 'k-ya'],
    ['k-gya', 'k-gi', 'k-ya'],
    ['k-ja', 'k-ji', 'k-ya'],
    ['k-bya', 'k-bi', 'k-ya'],
    ['k-pya', 'k-pi', 'k-ya'],
    ['k-kyu', 'k-ki', 'k-yu'],
    ['k-shu', 'k-shi', 'k-yu'],
    ['k-chu', 'k-chi', 'k-yu'],
    ['k-nyu', 'k-ni', 'k-yu'],
    ['k-hyu', 'k-hi', 'k-yu'],
    ['k-myu', 'k-mi', 'k-yu'],
    ['k-ryu', 'k-ri', 'k-yu'],
    ['k-gyu', 'k-gi', 'k-yu'],
    ['k-ju', 'k-ji', 'k-yu'],
    ['k-byu', 'k-bi', 'k-yu'],
    ['k-pyu', 'k-pi', 'k-yu'],
    ['k-kyo', 'k-ki', 'k-yo'],
    ['k-sho', 'k-shi', 'k-yo'],
    ['k-cho', 'k-chi', 'k-yo'],
    ['k-nyo', 'k-ni', 'k-yo'],
    ['k-hyo', 'k-hi', 'k-yo'],
    ['k-myo', 'k-mi', 'k-yo'],
    ['k-ryo', 'k-ri', 'k-yo'],
    ['k-gyo', 'k-gi', 'k-yo'],
    ['k-jo', 'k-ji', 'k-yo'],
    ['k-byo', 'k-bi', 'k-yo'],
    ['k-pyo', 'k-pi', 'k-yo']
  ];

  yoonMappings.forEach(([targetId, baseId, smallId]) => {
    derived[targetId] = composeDrawingData(
      transformDrawingData(getDrawingData(baseId), {
        translateX: COMBINED_MAIN_OFFSET_X
      }),
      transformDrawingData(getDrawingData(smallId), {
        scale: COMBINED_SMALL_SCALE,
        translateX: COMBINED_SMALL_OFFSET_X,
        translateY: COMBINED_SMALL_OFFSET_Y
      })
    );
  });

  derived['k-vu'] = drawingGuideLibrary['k-vu'] ?? composeDrawingData(getDrawingData('k-u'), createDakutenData());

  const extendedMappings: Array<[string, string, string]> = [
    ['k-fa', 'k-fu', 'k-a'],
    ['k-va', 'k-vu', 'k-a'],
    ['k-tsa', 'k-tsu', 'k-a'],
    ['k-fi', 'k-fu', 'k-i'],
    ['k-vi', 'k-vu', 'k-i'],
    ['k-tsi', 'k-tsu', 'k-i'],
    ['k-ti', 'k-te', 'k-i'],
    ['k-di', 'k-de', 'k-i'],
    ['k-tu', 'k-to', 'k-u'],
    ['k-du', 'k-do', 'k-u'],
    ['k-fe', 'k-fu', 'k-e'],
    ['k-ve', 'k-vu', 'k-e'],
    ['k-tse', 'k-tsu', 'k-e'],
    ['k-che', 'k-chi', 'k-e'],
    ['k-she', 'k-shi', 'k-e'],
    ['k-je', 'k-ji', 'k-e'],
    ['k-fo', 'k-fu', 'k-o'],
    ['k-vo', 'k-vu', 'k-o'],
    ['k-tso', 'k-tsu', 'k-o']
  ];

  extendedMappings.forEach(([targetId, baseId, smallId]) => {
    derived[targetId] = composeDrawingData(
      transformDrawingData(getDrawingData(baseId), {
        translateX: COMBINED_MAIN_OFFSET_X
      }),
      transformDrawingData(getDrawingData(smallId), {
        scale: COMBINED_VOWEL_SCALE,
        translateX: COMBINED_VOWEL_OFFSET_X,
        translateY: COMBINED_VOWEL_OFFSET_Y
      })
    );
  });

  return derived;
};

Object.assign(drawingGuideLibrary, generatedKanaDrawingGuides);
Object.assign(drawingGuideLibrary, createDerivedDrawingGuides());

const attachDrawingData = (matrix: (Character | null)[][]) => {
  matrix.forEach((row) => {
    row.forEach((character) => {
      if (!character) {
        return;
      }

      const drawingData = drawingGuideLibrary[character.id];

      if (character.drawingData) {
        character.drawingData = mergeCharacterDrawingData(character.drawingData, drawingData);
        return;
      }

      if (drawingData) {
        character.drawingData = normalizeDrawingDataForDisplay(drawingData);
      }
    });
  });
};

// --- HIRAGANA ---

export const hiraganaSingleMatrix: (Character | null)[][] = [
  // Row 1: a
  [
    { 
      id: 'h-a', 
      symbol: 'あ', 
      label: 'a',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        strokeGuides: [
          { index: 1, labelX: 72, labelY: 126, arrowFrom: { x: 92, y: 128 }, arrowTo: { x: 128, y: 122 }, color: '#ef4444' },
          { index: 2, labelX: 134, labelY: 52, arrowFrom: { x: 134, y: 70 }, arrowTo: { x: 134, y: 106 }, color: '#3b82f6' },
          { index: 3, labelX: 228, labelY: 108, arrowFrom: { x: 244, y: 118 }, arrowTo: { x: 216, y: 144 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'h-ka', symbol: 'か', label: 'ka' }, { id: 'h-sa', symbol: 'さ', label: 'sa' }, { id: 'h-ta', symbol: 'た', label: 'ta' }, { id: 'h-na', symbol: 'な', label: 'na' }, { id: 'h-ha', symbol: 'は', label: 'ha' }, { id: 'h-ma', symbol: 'ま', label: 'ma' }, { id: 'h-ya', symbol: 'や', label: 'ya' }, { id: 'h-ra', symbol: 'ら', label: 'ra' }, { id: 'h-wa', symbol: 'わ', label: 'wa' }, null, { id: 'h-ga', symbol: 'が', label: 'ga' }, { id: 'h-za', symbol: 'ざ', label: 'za' }, { id: 'h-da', symbol: 'だ', label: 'da' }, { id: 'h-ba', symbol: 'ば', label: 'ba' }, { id: 'h-pa', symbol: 'ぱ', label: 'pa' }
  ],
  // Row 2: i
  [
    { 
      id: 'h-i', 
      symbol: 'い', 
      label: 'i',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 52, labelY: 86, arrowFrom: { x: 70, y: 96 }, arrowTo: { x: 70, y: 158 }, color: '#ef4444' },
          { index: 2, labelX: 234, labelY: 88, arrowFrom: { x: 224, y: 98 }, arrowTo: { x: 224, y: 154 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'h-ki', symbol: 'き', label: 'ki' }, { id: 'h-shi', symbol: 'し', label: 'shi' }, { id: 'h-chi', symbol: 'ち', label: 'chi' }, { id: 'h-ni', symbol: 'に', label: 'ni' }, { id: 'h-hi', symbol: 'ひ', label: 'hi' }, { id: 'h-mi', symbol: 'み', label: 'mi' }, null, { id: 'h-ri', symbol: 'り', label: 'ri' }, null, null, { id: 'h-gi', symbol: 'ぎ', label: 'gi' }, { id: 'h-ji', symbol: 'じ', label: 'ji' }, { id: 'h-dji', symbol: 'ぢ', label: 'ji' }, { id: 'h-bi', symbol: 'び', label: 'bi' }, { id: 'h-pi', symbol: 'ぴ', label: 'pi' }
  ],
  // Row 3: u
  [
    { 
      id: 'h-u', 
      symbol: 'う', 
      label: 'u',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 102, labelY: 34, arrowFrom: { x: 118, y: 40 }, arrowTo: { x: 150, y: 56 }, color: '#ef4444' },
          { index: 2, labelX: 68, labelY: 96, arrowFrom: { x: 86, y: 102 }, arrowTo: { x: 150, y: 114 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'h-ku', symbol: 'く', label: 'ku' }, { id: 'h-su', symbol: 'す', label: 'su' }, { id: 'h-tsu', symbol: 'つ', label: 'tsu' }, { id: 'h-nu', symbol: 'ぬ', label: 'nu' }, { id: 'h-fu', symbol: 'ふ', label: 'fu' }, { id: 'h-mu', symbol: 'む', label: 'mu' }, { id: 'h-yu', symbol: 'ゆ', label: 'yu' }, { id: 'h-ru', symbol: 'る', label: 'ru' }, null, null, { id: 'h-gu', symbol: 'ぐ', label: 'gu' }, { id: 'h-zu', symbol: 'ず', label: 'zu' }, { id: 'h-dzu', symbol: 'づ', label: 'zu' }, { id: 'h-bu', symbol: 'ぶ', label: 'bu' }, { id: 'h-pu', symbol: 'ぷ', label: 'pu' }
  ],
  // Row 4: e
  [
    { 
      id: 'h-e', 
      symbol: 'え', 
      label: 'e',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 102, labelY: 34, arrowFrom: { x: 118, y: 40 }, arrowTo: { x: 150, y: 58 }, color: '#ef4444' },
          { index: 2, labelX: 68, labelY: 96, arrowFrom: { x: 86, y: 100 }, arrowTo: { x: 154, y: 100 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'h-ke', symbol: 'け', label: 'ke' }, { id: 'h-se', symbol: 'せ', label: 'se' }, { id: 'h-te', symbol: 'て', label: 'te' }, { id: 'h-ne', symbol: 'ね', label: 'ne' }, { id: 'h-he', symbol: 'へ', label: 'he' }, { id: 'h-me', symbol: 'め', label: 'me' }, null, { id: 'h-re', symbol: 'れ', label: 're' }, null, null, { id: 'h-ge', symbol: 'げ', label: 'ge' }, { id: 'h-ze', symbol: 'ぜ', label: 'ze' }, { id: 'h-de', symbol: 'で', label: 'de' }, { id: 'h-be', symbol: 'べ', label: 'be' }, { id: 'h-pe', symbol: 'ぺ', label: 'pe' }
  ],
  // Row 5: o
  [
    { 
      id: 'h-o', 
      symbol: 'お', 
      label: 'o',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        safeZone: { x: 72, y: 42, width: 156, height: 196 },
        strokeGuides: [
          { index: 1, labelX: 42, labelY: 42, arrowFrom: { x: 58, y: 42 }, arrowTo: { x: 126, y: 42 }, color: '#ef4444' },
          { index: 2, labelX: 92, labelY: 18, arrowFrom: { x: 104, y: 28 }, arrowTo: { x: 104, y: 102 }, color: '#3b82f6' },
          { index: 3, labelX: 228, labelY: 54, arrowFrom: { x: 244, y: 64 }, arrowTo: { x: 264, y: 88 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'h-ko', symbol: 'こ', label: 'ko' }, { id: 'h-so', symbol: 'そ', label: 'so' }, { id: 'h-to', symbol: 'と', label: 'to' }, { id: 'h-no', symbol: 'の', label: 'no' }, { id: 'h-ho', symbol: 'ほ', label: 'ho' }, { id: 'h-mo', symbol: 'も', label: 'mo' }, { id: 'h-yo', symbol: 'よ', label: 'yo' }, { id: 'h-ro', symbol: 'ろ', label: 'ro' }, { id: 'h-wo', symbol: 'を', label: 'wo' }, { id: 'h-n', symbol: 'ん', label: 'n' }, { id: 'h-go', symbol: 'ご', label: 'go' }, { id: 'h-zo', symbol: 'ぞ', label: 'zo' }, { id: 'h-do', symbol: 'ど', label: 'do' }, { id: 'h-bo', symbol: 'ぼ', label: 'bo' }, { id: 'h-po', symbol: 'ぽ', label: 'po' }
  ]
];

export const hiraganaDoubleMatrix: (Character | null)[][] = [
  // Row 1: ya
  [
    { id: 'h-kya', symbol: 'きゃ', label: 'kya' }, { id: 'h-sha', symbol: 'しゃ', label: 'sha' }, { id: 'h-cha', symbol: 'ちゃ', label: 'cha' }, { id: 'h-nya', symbol: 'にゃ', label: 'nya' }, { id: 'h-hya', symbol: 'ひゃ', label: 'hya' }, { id: 'h-mya', symbol: 'みゃ', label: 'mya' }, { id: 'h-rya', symbol: 'りゃ', label: 'rya' }, { id: 'h-gya', symbol: 'ぎゃ', label: 'gya' }, { id: 'h-ja', symbol: 'じゃ', label: 'ja' }, { id: 'h-bya', symbol: 'びゃ', label: 'bya' }, { id: 'h-pya', symbol: 'ぴゃ', label: 'pya' }
  ],
  // Row 2: yu
  [
    { id: 'h-kyu', symbol: 'きゅ', label: 'kyu' }, { id: 'h-shu', symbol: 'しゅ', label: 'shu' }, { id: 'h-chu', symbol: 'ちゅ', label: 'chu' }, { id: 'h-nyu', symbol: 'にゅ', label: 'nyu' }, { id: 'h-hyu', symbol: 'ひゅ', label: 'hyu' }, { id: 'h-myu', symbol: 'みゅ', label: 'myu' }, { id: 'h-ryu', symbol: 'りゅ', label: 'ryu' }, { id: 'h-gyu', symbol: 'ぎゅ', label: 'gyu' }, { id: 'h-ju', symbol: 'じゅ', label: 'ju' }, { id: 'h-byu', symbol: 'びゅ', label: 'byu' }, { id: 'h-pyu', symbol: 'ぴゅ', label: 'pyu' }
  ],
  // Row 3: yo
  [
    { id: 'h-kyo', symbol: 'きょ', label: 'kyo' }, { id: 'h-sho', symbol: 'しょ', label: 'sho' }, { id: 'h-cho', symbol: 'ちょ', label: 'cho' }, { id: 'h-nyo', symbol: 'にょ', label: 'nyo' }, { id: 'h-hyo', symbol: 'ひょ', label: 'hyo' }, { id: 'h-myo', symbol: 'みょ', label: 'myo' }, { id: 'h-ryo', symbol: 'りょ', label: 'ryo' }, { id: 'h-gyo', symbol: 'ぎょ', label: 'gyo' }, { id: 'h-jo', symbol: 'じょ', label: 'jo' }, { id: 'h-byo', symbol: 'びょ', label: 'byo' }, { id: 'h-pyo', symbol: 'ぴょ', label: 'pyo' }
  ]
];

// --- KATAKANA ---

export const katakanaSingleMatrix: (Character | null)[][] = [
  // Row 1: a
  [
    { 
      id: 'k-a', 
      symbol: 'ア', 
      label: 'a',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 60, labelY: 58, arrowFrom: { x: 78, y: 52 }, arrowTo: { x: 154, y: 52 }, color: '#ef4444' },
          { index: 2, labelX: 132, labelY: 104, arrowFrom: { x: 142, y: 116 }, arrowTo: { x: 142, y: 184 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'k-ka', symbol: 'カ', label: 'ka' }, { id: 'k-sa', symbol: 'サ', label: 'sa' }, { id: 'k-ta', symbol: 'タ', label: 'ta' }, { id: 'k-na', symbol: 'ナ', label: 'na' }, { id: 'k-ha', symbol: 'ハ', label: 'ha' }, { id: 'k-ma', symbol: 'マ', label: 'ma' }, { id: 'k-ya', symbol: 'ヤ', label: 'ya' }, { id: 'k-ra', symbol: 'ラ', label: 'ra' }, { id: 'k-wa', symbol: 'ワ', label: 'wa' }, null, { id: 'k-ga', symbol: 'ガ', label: 'ga' }, { id: 'k-za', symbol: 'ザ', label: 'za' }, { id: 'k-da', symbol: 'ダ', label: 'da' }, { id: 'k-ba', symbol: 'バ', label: 'ba' }, { id: 'k-pa', symbol: 'パ', label: 'pa' }
  ],
  // Row 2: i
  [
    { 
      id: 'k-i', 
      symbol: 'イ', 
      label: 'i',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 2,
        strokeGuides: [
          { index: 1, labelX: 178, labelY: 36, arrowFrom: { x: 190, y: 46 }, arrowTo: { x: 152, y: 118 }, color: '#ef4444' },
          { index: 2, labelX: 214, labelY: 104, arrowFrom: { x: 224, y: 118 }, arrowTo: { x: 224, y: 196 }, color: '#3b82f6' }
        ]
      }
    }, 
    { id: 'k-ki', symbol: 'キ', label: 'ki' }, { id: 'k-shi', symbol: 'シ', label: 'shi' }, { id: 'k-chi', symbol: 'チ', label: 'chi' }, { id: 'k-ni', symbol: 'ニ', label: 'ni' }, { id: 'k-hi', symbol: 'ヒ', label: 'hi' }, { id: 'k-mi', symbol: 'ミ', label: 'mi' }, null, { id: 'k-ri', symbol: 'リ', label: 'ri' }, null, null, { id: 'k-gi', symbol: 'ギ', label: 'gi' }, { id: 'k-ji', symbol: 'ジ', label: 'ji' }, { id: 'k-dji', symbol: 'ヂ', label: 'ji' }, { id: 'k-bi', symbol: 'ビ', label: 'bi' }, { id: 'k-pi', symbol: 'ピ', label: 'pi' }
  ],
  // Row 3: u
  [
    { 
      id: 'k-u', 
      symbol: 'ウ', 
      label: 'u',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        strokeGuides: [
          { index: 1, labelX: 138, labelY: 24, arrowFrom: { x: 150, y: 34 }, arrowTo: { x: 150, y: 60 }, color: '#ef4444' },
          { index: 2, labelX: 70, labelY: 92, arrowFrom: { x: 88, y: 96 }, arrowTo: { x: 154, y: 96 }, color: '#3b82f6' },
          { index: 3, labelX: 194, labelY: 122, arrowFrom: { x: 204, y: 136 }, arrowTo: { x: 204, y: 208 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'k-ku', symbol: 'ク', label: 'ku' }, { id: 'k-su', symbol: 'ス', label: 'su' }, { id: 'k-tsu', symbol: 'ツ', label: 'tsu' }, { id: 'k-nu', symbol: 'ヌ', label: 'nu' }, { id: 'k-fu', symbol: 'フ', label: 'fu' }, { id: 'k-mu', symbol: 'ム', label: 'mu' }, { id: 'k-yu', symbol: 'ユ', label: 'yu' }, { id: 'k-ru', symbol: 'ル', label: 'ru' }, null, null, { id: 'k-gu', symbol: 'グ', label: 'gu' }, { id: 'k-zu', symbol: 'ズ', label: 'zu' }, { id: 'k-dzu', symbol: 'ヅ', label: 'zu' }, { id: 'k-bu', symbol: 'ブ', label: 'bu' }, { id: 'k-pu', symbol: 'プ', label: 'pu' }
  ],
  // Row 4: e
  [
    { 
      id: 'k-e', 
      symbol: 'エ', 
      label: 'e',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        strokeGuides: [
          { index: 1, labelX: 60, labelY: 56, arrowFrom: { x: 78, y: 50 }, arrowTo: { x: 156, y: 50 }, color: '#ef4444' },
          { index: 2, labelX: 122, labelY: 84, arrowFrom: { x: 132, y: 96 }, arrowTo: { x: 132, y: 176 }, color: '#3b82f6' },
          { index: 3, labelX: 60, labelY: 222, arrowFrom: { x: 80, y: 214 }, arrowTo: { x: 162, y: 214 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'k-ke', symbol: 'ケ', label: 'ke' }, { id: 'k-se', symbol: 'セ', label: 'se' }, { id: 'k-te', symbol: 'テ', label: 'te' }, { id: 'k-ne', symbol: 'ネ', label: 'ne' }, { id: 'k-he', symbol: 'ヘ', label: 'he' }, { id: 'k-me', symbol: 'メ', label: 'me' }, null, { id: 'k-re', symbol: 'レ', label: 're' }, null, null, { id: 'k-ge', symbol: 'ゲ', label: 'ge' }, { id: 'k-ze', symbol: 'ゼ', label: 'ze' }, { id: 'k-de', symbol: 'デ', label: 'de' }, { id: 'k-be', symbol: 'ベ', label: 'be' }, { id: 'k-pe', symbol: 'ペ', label: 'pe' }
  ],
  // Row 5: o
  [
    { 
      id: 'k-o', 
      symbol: 'オ', 
      label: 'o',
      drawingData: {
        viewBoxWidth: 300,
        viewBoxHeight: 300,
        strokeCount: 3,
        safeZone: { x: 78, y: 46, width: 150, height: 188 },
        strokeGuides: [
          { index: 1, labelX: 48, labelY: 46, arrowFrom: { x: 64, y: 46 }, arrowTo: { x: 132, y: 46 }, color: '#ef4444' },
          { index: 2, labelX: 106, labelY: 76, arrowFrom: { x: 118, y: 88 }, arrowTo: { x: 118, y: 158 }, color: '#3b82f6' },
          { index: 3, labelX: 64, labelY: 112, arrowFrom: { x: 80, y: 124 }, arrowTo: { x: 60, y: 170 }, color: '#10b981' }
        ]
      }
    }, 
    { id: 'k-ko', symbol: 'コ', label: 'ko' }, { id: 'k-so', symbol: 'ソ', label: 'so' }, { id: 'k-to', symbol: 'ト', label: 'to' }, { id: 'k-no', symbol: 'ノ', label: 'no' }, { id: 'k-ho', symbol: 'ホ', label: 'ho' }, { id: 'k-mo', symbol: 'モ', label: 'mo' }, { id: 'k-yo', symbol: 'ヨ', label: 'yo' }, { id: 'k-ro', symbol: 'ロ', label: 'ro' }, { id: 'k-wo', symbol: 'ヲ', label: 'wo' }, { id: 'k-n', symbol: 'ン', label: 'n' }, { id: 'k-go', symbol: 'ゴ', label: 'go' }, { id: 'k-zo', symbol: 'ゾ', label: 'zo' }, { id: 'k-do', symbol: 'ド', label: 'do' }, { id: 'k-bo', symbol: 'ボ', label: 'bo' }, { id: 'k-po', symbol: 'ポ', label: 'po' }
  ]
];

export const katakanaDoubleMatrix: (Character | null)[][] = [
  // Row 1: ya
  [
    { id: 'k-kya', symbol: 'キャ', label: 'kya' }, { id: 'k-sha', symbol: 'シャ', label: 'sha' }, { id: 'k-cha', symbol: 'チャ', label: 'cha' }, { id: 'k-nya', symbol: 'ニャ', label: 'nya' }, { id: 'k-hya', symbol: 'ヒャ', label: 'hya' }, { id: 'k-mya', symbol: 'ミャ', label: 'mya' }, { id: 'k-rya', symbol: 'リャ', label: 'rya' }, { id: 'k-gya', symbol: 'ギャ', label: 'gya' }, { id: 'k-ja', symbol: 'ジャ', label: 'ja' }, { id: 'k-bya', symbol: 'ビャ', label: 'bya' }, { id: 'k-pya', symbol: 'ピャ', label: 'pya' }
  ],
  // Row 2: yu
  [
    { id: 'k-kyu', symbol: 'キュ', label: 'kyu' }, { id: 'k-shu', symbol: 'シュ', label: 'shu' }, { id: 'k-chu', symbol: 'チュ', label: 'chu' }, { id: 'k-nyu', symbol: 'ニュ', label: 'nyu' }, { id: 'k-hyu', symbol: 'ヒュ', label: 'hyu' }, { id: 'k-myu', symbol: 'ミュ', label: 'myu' }, { id: 'k-ryu', symbol: 'リュ', label: 'ryu' }, { id: 'k-gyu', symbol: 'ギュ', label: 'gyu' }, { id: 'k-ju', symbol: 'ジュ', label: 'ju' }, { id: 'k-byu', symbol: 'ビュ', label: 'byu' }, { id: 'k-pyu', symbol: 'ピュ', label: 'pyu' }
  ],
  // Row 3: yo
  [
    { id: 'k-kyo', symbol: 'キョ', label: 'kyo' }, { id: 'k-sho', symbol: 'ショ', label: 'sho' }, { id: 'k-cho', symbol: 'チョ', label: 'cho' }, { id: 'k-nyo', symbol: 'ニョ', label: 'nyo' }, { id: 'k-hyo', symbol: 'ヒョ', label: 'hyo' }, { id: 'k-myo', symbol: 'ミョ', label: 'myo' }, { id: 'k-ryo', symbol: 'リョ', label: 'ryo' }, { id: 'k-gyo', symbol: 'ギョ', label: 'gyo' }, { id: 'k-jo', symbol: 'ジョ', label: 'jo' }, { id: 'k-byo', symbol: 'ビョ', label: 'byo' }, { id: 'k-pyo', symbol: 'ピョ', label: 'pyo' }
  ]
];

export const katakanaExtendedMatrix: (Character | null)[][] = [
  // Row 1: a
  [ { id: 'k-fa', symbol: 'ファ', label: 'fa' }, { id: 'k-va', symbol: 'ヴァ', label: 'va' }, { id: 'k-tsa', symbol: 'ツァ', label: 'tsa' }, null, null, null ],
  // Row 2: i
  [ { id: 'k-fi', symbol: 'フィ', label: 'fi' }, { id: 'k-vi', symbol: 'ヴィ', label: 'vi' }, { id: 'k-tsi', symbol: 'ツィ', label: 'tsi' }, { id: 'k-ti', symbol: 'ティ', label: 'ti' }, { id: 'k-di', symbol: 'ディ', label: 'di' }, null ],
  // Row 3: u
  [ null, { id: 'k-vu', symbol: 'ヴ', label: 'vu' }, null, { id: 'k-tu', symbol: 'トゥ', label: 'tu' }, { id: 'k-du', symbol: 'ドゥ', label: 'du' }, null ],
  // Row 4: e
  [ { id: 'k-fe', symbol: 'フェ', label: 'fe' }, { id: 'k-ve', symbol: 'ヴェ', label: 've' }, { id: 'k-tse', symbol: 'ツェ', label: 'tse' }, { id: 'k-che', symbol: 'チェ', label: 'che' }, { id: 'k-she', symbol: 'シェ', label: 'she' }, { id: 'k-je', symbol: 'ジェ', label: 'je' } ],
  // Row 5: o
  [ { id: 'k-fo', symbol: 'フォ', label: 'fo' }, { id: 'k-vo', symbol: 'ヴォ', label: 'vo' }, { id: 'k-tso', symbol: 'ツォ', label: 'tso' }, null, null, null ]
];

attachDrawingData(hiraganaSingleMatrix);
attachDrawingData(hiraganaDoubleMatrix);
attachDrawingData(katakanaSingleMatrix);
attachDrawingData(katakanaDoubleMatrix);
attachDrawingData(katakanaExtendedMatrix);

// --- SECTIONS FOR STUDY MODE ---

function getCol(matrix: (Character | null)[][], colIndex: number, id: string, label: string): KanaGroup {
  return {
    id,
    label,
    characters: matrix.map(row => row[colIndex]).filter((c): c is Character => c !== null)
  };
}

export const hiraganaSections: KanaSection[] = [
  {
    id: 'hiragana-single',
    title: 'Single Characters',
    description: 'The basic Japanese phonetic script, used for native Japanese words.',
    matrix: hiraganaSingleMatrix,
    columnGroupIds: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n', 'ga', 'za', 'da', 'ba', 'pa'],
    groups: [
      getCol(hiraganaSingleMatrix, 0, 'a', 'A Column'),
      getCol(hiraganaSingleMatrix, 1, 'ka', 'Ka Column'),
      getCol(hiraganaSingleMatrix, 2, 'sa', 'Sa Column'),
      getCol(hiraganaSingleMatrix, 3, 'ta', 'Ta Column'),
      getCol(hiraganaSingleMatrix, 4, 'na', 'Na Column'),
      getCol(hiraganaSingleMatrix, 5, 'ha', 'Ha Column'),
      getCol(hiraganaSingleMatrix, 6, 'ma', 'Ma Column'),
      getCol(hiraganaSingleMatrix, 7, 'ya', 'Ya Column'),
      getCol(hiraganaSingleMatrix, 8, 'ra', 'Ra Column'),
      getCol(hiraganaSingleMatrix, 9, 'wa', 'Wa Column'),
      getCol(hiraganaSingleMatrix, 10, 'n', 'N Column'),
      getCol(hiraganaSingleMatrix, 11, 'ga', 'Ga Column'),
      getCol(hiraganaSingleMatrix, 12, 'za', 'Za Column'),
      getCol(hiraganaSingleMatrix, 13, 'da', 'Da Column'),
      getCol(hiraganaSingleMatrix, 14, 'ba', 'Ba Column'),
      getCol(hiraganaSingleMatrix, 15, 'pa', 'Pa Column'),
    ]
  },
  {
    id: 'hiragana-double',
    title: 'Double Characters',
    description: 'Combinations of characters with ya, yu, yo.',
    matrix: hiraganaDoubleMatrix,
    columnGroupIds: ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya'],
    groups: [
      getCol(hiraganaDoubleMatrix, 0, 'kya', 'Kya Column'),
      getCol(hiraganaDoubleMatrix, 1, 'sha', 'Sha Column'),
      getCol(hiraganaDoubleMatrix, 2, 'cha', 'Cha Column'),
      getCol(hiraganaDoubleMatrix, 3, 'nya', 'Nya Column'),
      getCol(hiraganaDoubleMatrix, 4, 'hya', 'Hya Column'),
      getCol(hiraganaDoubleMatrix, 5, 'mya', 'Mya Column'),
      getCol(hiraganaDoubleMatrix, 6, 'rya', 'Rya Column'),
      getCol(hiraganaDoubleMatrix, 7, 'gya', 'Gya Column'),
      getCol(hiraganaDoubleMatrix, 8, 'ja', 'Ja Column'),
      getCol(hiraganaDoubleMatrix, 9, 'bya', 'Bya Column'),
      getCol(hiraganaDoubleMatrix, 10, 'pya', 'Pya Column'),
    ]
  }
];

export const katakanaSections: KanaSection[] = [
  {
    id: 'katakana-single',
    title: 'Single Characters',
    description: 'Used primarily for foreign loanwords, onomatopoeia, and emphasis.',
    matrix: katakanaSingleMatrix,
    columnGroupIds: ['a', 'ka', 'sa', 'ta', 'na', 'ha', 'ma', 'ya', 'ra', 'wa', 'n', 'ga', 'za', 'da', 'ba', 'pa'],
    groups: [
      getCol(katakanaSingleMatrix, 0, 'a', 'A Column'),
      getCol(katakanaSingleMatrix, 1, 'ka', 'Ka Column'),
      getCol(katakanaSingleMatrix, 2, 'sa', 'Sa Column'),
      getCol(katakanaSingleMatrix, 3, 'ta', 'Ta Column'),
      getCol(katakanaSingleMatrix, 4, 'na', 'Na Column'),
      getCol(katakanaSingleMatrix, 5, 'ha', 'Ha Column'),
      getCol(katakanaSingleMatrix, 6, 'ma', 'Ma Column'),
      getCol(katakanaSingleMatrix, 7, 'ya', 'Ya Column'),
      getCol(katakanaSingleMatrix, 8, 'ra', 'Ra Column'),
      getCol(katakanaSingleMatrix, 9, 'wa', 'Wa Column'),
      getCol(katakanaSingleMatrix, 10, 'n', 'N Column'),
      getCol(katakanaSingleMatrix, 11, 'ga', 'Ga Column'),
      getCol(katakanaSingleMatrix, 12, 'za', 'Za Column'),
      getCol(katakanaSingleMatrix, 13, 'da', 'Da Column'),
      getCol(katakanaSingleMatrix, 14, 'ba', 'Ba Column'),
      getCol(katakanaSingleMatrix, 15, 'pa', 'Pa Column'),
    ]
  },
  {
    id: 'katakana-double',
    title: 'Double Characters',
    description: 'Combinations of characters with ya, yu, yo.',
    matrix: katakanaDoubleMatrix,
    columnGroupIds: ['kya', 'sha', 'cha', 'nya', 'hya', 'mya', 'rya', 'gya', 'ja', 'bya', 'pya'],
    groups: [
      getCol(katakanaDoubleMatrix, 0, 'kya', 'Kya Column'),
      getCol(katakanaDoubleMatrix, 1, 'sha', 'Sha Column'),
      getCol(katakanaDoubleMatrix, 2, 'cha', 'Cha Column'),
      getCol(katakanaDoubleMatrix, 3, 'nya', 'Nya Column'),
      getCol(katakanaDoubleMatrix, 4, 'hya', 'Hya Column'),
      getCol(katakanaDoubleMatrix, 5, 'mya', 'Mya Column'),
      getCol(katakanaDoubleMatrix, 6, 'rya', 'Rya Column'),
      getCol(katakanaDoubleMatrix, 7, 'gya', 'Gya Column'),
      getCol(katakanaDoubleMatrix, 8, 'ja', 'Ja Column'),
      getCol(katakanaDoubleMatrix, 9, 'bya', 'Bya Column'),
      getCol(katakanaDoubleMatrix, 10, 'pya', 'Pya Column'),
    ]
  },
  {
    id: 'katakana-extended',
    title: 'Extended Characters',
    description: 'Modern additions for more accurate foreign sound representation.',
    matrix: katakanaExtendedMatrix,
    columnGroupIds: ['fa', 'va', 'tsa', 'ti', 'di', 'je'],
    groups: [
      getCol(katakanaExtendedMatrix, 0, 'fa', 'F- Group'),
      getCol(katakanaExtendedMatrix, 1, 'va', 'V- Group'),
      getCol(katakanaExtendedMatrix, 2, 'tsa', 'Ts- Group'),
      getCol(katakanaExtendedMatrix, 3, 'ti', 'T/Ch Group'),
      getCol(katakanaExtendedMatrix, 4, 'di', 'D/Sh Group'),
      getCol(katakanaExtendedMatrix, 5, 'je', 'J Group'),
    ]
  }
];
