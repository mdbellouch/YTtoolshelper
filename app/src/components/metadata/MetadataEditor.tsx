import { useState, useEffect } from 'react';
import { Edit2, Save, Tag, User, Calendar, Eye, Clock, Folder, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { VideoMetadata } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MetadataEditorProps {
  metadata: VideoMetadata;
  onSave: (metadata: VideoMetadata) => void;
  isEditable?: boolean;
}

export default function MetadataEditor({ metadata, onSave, isEditable = true }: MetadataEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMetadata, setEditedMetadata] = useState<VideoMetadata>(metadata);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setEditedMetadata(metadata);
  }, [metadata]);

  const handleSave = () => {
    onSave(editedMetadata);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedMetadata.tags.includes(newTag.trim())) {
      setEditedMetadata({
        ...editedMetadata,
        tags: [...editedMetadata.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedMetadata({
      ...editedMetadata,
      tags: editedMetadata.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const renderField = (
    icon: React.ReactNode,
    label: string,
    value: string,
    onChange?: (value: string) => void,
    isTextarea = false
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-white/60">
        {icon}
        <Label className="text-xs uppercase tracking-wider">{label}</Label>
      </div>
      {isEditing && onChange ? (
        isTextarea ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/5 border-white/10 text-white min-h-[100px] resize-none focus:border-white/30"
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-white/5 border-white/10 text-white focus:border-white/30"
          />
        )
      ) : (
        <p className={`text-white ${isTextarea ? 'text-sm leading-relaxed' : 'font-medium'}`}>
          {value || <span className="text-white/30 italic">Not specified</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className="glass-effect rounded-xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Video Metadata</h3>
        {isEditable && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="border-white/20 hover:bg-white/10"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-6">
          {/* Thumbnail */}
          {editedMetadata.thumbnailUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-white/60">
                <Image className="w-4 h-4" />
                <Label className="text-xs uppercase tracking-wider">Thumbnail</Label>
              </div>
              <div className="aspect-video rounded-lg overflow-hidden bg-white/5">
                <img
                  src={editedMetadata.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/640x360?text=No+Thumbnail';
                  }}
                />
              </div>
            </div>
          )}

          {/* Title */}
          {renderField(
            <Edit2 className="w-4 h-4" />,
            'Title',
            editedMetadata.title,
            (value) => setEditedMetadata({ ...editedMetadata, title: value })
          )}

          {/* Description */}
          {renderField(
            <Edit2 className="w-4 h-4" />,
            'Description',
            editedMetadata.description,
            (value) => setEditedMetadata({ ...editedMetadata, description: value }),
            true
          )}

          {/* Author */}
          {renderField(
            <User className="w-4 h-4" />,
            'Author / Channel',
            editedMetadata.author,
            (value) => setEditedMetadata({ ...editedMetadata, author: value })
          )}

          {/* Duration */}
          {renderField(
            <Clock className="w-4 h-4" />,
            'Duration',
            editedMetadata.duration,
            (value) => setEditedMetadata({ ...editedMetadata, duration: value })
          )}

          {/* Upload Date */}
          {renderField(
            <Calendar className="w-4 h-4" />,
            'Upload Date',
            editedMetadata.uploadDate,
            (value) => setEditedMetadata({ ...editedMetadata, uploadDate: value })
          )}

          {/* Views */}
          {renderField(
            <Eye className="w-4 h-4" />,
            'Views',
            editedMetadata.views,
            (value) => setEditedMetadata({ ...editedMetadata, views: value })
          )}

          {/* Category */}
          {renderField(
            <Folder className="w-4 h-4" />,
            'Category',
            editedMetadata.category,
            (value) => setEditedMetadata({ ...editedMetadata, category: value })
          )}

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/60">
              <Tag className="w-4 h-4" />
              <Label className="text-xs uppercase tracking-wider">Tags</Label>
            </div>
            
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a tag..."
                  className="bg-white/5 border-white/10 text-white focus:border-white/30"
                />
                <Button
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                >
                  Add
                </Button>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {editedMetadata.tags.length > 0 ? (
                editedMetadata.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/10 text-white hover:bg-white/20 cursor-default"
                  >
                    {tag}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-white/60 hover:text-white"
                      >
                        ×
                      </button>
                    )}
                  </Badge>
                ))
              ) : (
                <span className="text-white/30 italic text-sm">No tags added</span>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
