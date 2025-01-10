import {
  InteractiveSentence,
  ListenButton,
  QuestionContainer,
  SpeakButton,
} from "./CommonComponents";
import { motion, AnimatePresence } from "framer-motion";

// Speaking Format
const SpeakingFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Speaking Practice">
    <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
      <InteractiveSentence
        text={question.prompt}
        dictionary={dictionary}
        onListen={onListen}
      />
      <div className="mt-4 flex gap-4">
        <ListenButton
          text={question.prompt}
          onListen={onListen}
          isPlaying={playingStatus[question.prompt]}
        />
        <SpeakButton
          onSpeak={onSpeak}
          isListening={isListening}
          isProcessing={isProcessing}
        />
      </div>
      {question.sampleAnswer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 p-4 bg-primary/5 rounded-xl"
        >
          <p className="font-semibold mb-2">Sample Answer:</p>
          <InteractiveSentence
            text={question.sampleAnswer}
            dictionary={dictionary}
            onListen={onListen}
          />
        </motion.div>
      )}
    </div>
  </QuestionContainer>
);

// Storytelling Format
const StorytellingFormat = ({
  question,
  onSpeak,
  isListening,
  isProcessing,
  dictionary,
}) => (
  <QuestionContainer title="Storytelling Practice">
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <h3 className="font-semibold mb-2">Story Prompt:</h3>
        <InteractiveSentence
          text={question.storyPrompt}
          dictionary={dictionary}
          onListen={onListen}
        />
      </div>

      {question.keywords && (
        <div className="flex flex-wrap gap-2">
          {question.keywords.map((keyword, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-1 bg-primary/10 rounded-full text-sm"
            >
              {keyword}
            </motion.span>
          ))}
        </div>
      )}

      {question.hints && (
        <div className="p-4 bg-primary/5 rounded-xl">
          <h3 className="font-semibold mb-2">Helpful Tips:</h3>
          <ul className="list-disc list-inside space-y-1">
            {question.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      <SpeakButton
        onSpeak={onSpeak}
        isListening={isListening}
        isProcessing={isProcessing}
        customText="Tell Your Story"
      />
    </div>
  </QuestionContainer>
);

// Listening Format
const ListeningFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Listening Practice">
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <ListenButton
          text="Listen to Audio"
          onListen={() => onListen(question.audioContent)}
          isPlaying={playingStatus[question.audioContent]}
        />

        {question.transcript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-4 p-4 bg-primary/5 rounded-xl"
          >
            <p className="font-semibold mb-2">Transcript:</p>
            <InteractiveSentence
              text={question.transcript}
              dictionary={dictionary}
              onListen={onListen}
            />
          </motion.div>
        )}
      </div>

      {question.questions?.map((q, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40"
        >
          <p className="font-semibold mb-2">Question {index + 1}:</p>
          <InteractiveSentence
            text={q}
            dictionary={dictionary}
            onListen={onListen}
          />
          <div className="mt-4">
            <SpeakButton
              onSpeak={() => onSpeak(index)}
              isListening={isListening}
              isProcessing={isProcessing}
              customText="Answer"
            />
          </div>
        </motion.div>
      ))}
    </div>
  </QuestionContainer>
);

// Listen and Repeat Format
const ListenAndRepeatFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Listen and Repeat">
    <div className="space-y-4">
      {question.phrases.map((phrase, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40"
        >
          <InteractiveSentence
            text={phrase}
            dictionary={dictionary}
            onListen={onListen}
          />
          <div className="mt-4 flex gap-4">
            <ListenButton
              text={phrase}
              onListen={onListen}
              isPlaying={playingStatus[phrase]}
            />
            <SpeakButton
              onSpeak={() => onSpeak(index)}
              isListening={isListening}
              isProcessing={isProcessing}
              customText="Repeat"
            />
          </div>

          {question.translations && question.translations[index] && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Translation: {question.translations[index]}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  </QuestionContainer>
);

// Multiple Choice Format
const MultipleChoiceFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
  selectedOption,
  onOptionSelect,
}) => (
  <QuestionContainer title="Multiple Choice">
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <InteractiveSentence
          text={question.prompt}
          dictionary={dictionary}
          onListen={onListen}
        />
        <div className="mt-4">
          <ListenButton
            text={question.prompt}
            onListen={onListen}
            isPlaying={playingStatus[question.prompt]}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl border dark:border-primary/30 border-primary/40 
              text-left transition-all duration-200
              ${
                selectedOption === index
                  ? "bg-primary/10 border-primary"
                  : "hover:bg-primary/5"
              }`}
            onClick={() => onOptionSelect(index)}
          >
            <div className="flex items-center justify-between">
              <InteractiveSentence
                text={option}
                dictionary={dictionary}
                onListen={onListen}
              />
              <ListenButton
                onListen={() => onListen(option)}
                isPlaying={playingStatus[option]}
                small
              />
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-6">
        <SpeakButton
          onSpeak={onSpeak}
          isListening={isListening}
          isProcessing={isProcessing}
          customText="Explain Your Choice"
        />
      </div>
    </div>
  </QuestionContainer>
);

// Grammar Speaking Format
const GrammarSpeakingFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Grammar Speaking Practice">
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-xl">
        <h3 className="font-semibold mb-2">Grammar Point:</h3>
        <p className="text-lg">{question.grammarPoint}</p>
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Example:</h3>
          <InteractiveSentence
            text={question.example}
            dictionary={dictionary}
            onListen={onListen}
          />
          <ListenButton
            text={question.example}
            onListen={onListen}
            isPlaying={playingStatus[question.example]}
            small
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <h3 className="font-semibold mb-2">Practice:</h3>
        <InteractiveSentence
          text={question.prompt}
          dictionary={dictionary}
          onListen={onListen}
        />
        <div className="mt-4 flex gap-4">
          <ListenButton
            text={question.prompt}
            onListen={onListen}
            isPlaying={playingStatus[question.prompt]}
          />
          <SpeakButton
            onSpeak={onSpeak}
            isListening={isListening}
            isProcessing={isProcessing}
            customText="Practice Grammar"
          />
        </div>
      </div>
    </div>
  </QuestionContainer>
);

// Idiom Practice Format
const IdiomPracticeFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Idiom Practice">
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold">"{question.idiom}"</h3>
          <ListenButton
            text={question.idiom}
            onListen={onListen}
            isPlaying={playingStatus[question.idiom]}
            small
          />
        </div>

        <div className="mt-4">
          <p className="font-semibold">Meaning:</p>
          <p className="text-gray-600 dark:text-gray-300">{question.meaning}</p>
        </div>

        <div className="mt-4">
          <p className="font-semibold">Example Usage:</p>
          <InteractiveSentence
            text={question.example}
            dictionary={dictionary}
            onListen={onListen}
          />
          <ListenButton
            text={question.example}
            onListen={onListen}
            isPlaying={playingStatus[question.example]}
            small
          />
        </div>

        {question.usageNotes && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <p className="font-semibold">Usage Notes:</p>
            <p className="text-sm">{question.usageNotes}</p>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <p className="font-semibold mb-2">Your Task:</p>
        <p>{question.prompt}</p>
        <div className="mt-4">
          <SpeakButton
            onSpeak={onSpeak}
            isListening={isListening}
            isProcessing={isProcessing}
            customText="Use the Idiom"
          />
        </div>
      </div>
    </div>
  </QuestionContainer>
);

// Look and Speak Format
const LookAndSpeakFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Look and Speak">
    <div className="space-y-4">
      {question.imageUrl && (
        <div className="rounded-xl overflow-hidden border dark:border-primary/30 border-primary/40">
          <img
            src={question.imageUrl}
            alt="Speaking prompt"
            className="w-full h-auto object-cover"
          />
          {question.imageCaption && (
            <p className="p-3 text-sm text-gray-600 dark:text-gray-300 bg-primary/5">
              {question.imageCaption}
            </p>
          )}
        </div>
      )}

      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <InteractiveSentence
          text={question.prompt}
          dictionary={dictionary}
          onListen={onListen}
        />
        <div className="mt-4 flex gap-4">
          <ListenButton
            text={question.prompt}
            onListen={onListen}
            isPlaying={playingStatus[question.prompt]}
          />
          <SpeakButton
            onSpeak={onSpeak}
            isListening={isListening}
            isProcessing={isProcessing}
            customText="Describe the Image"
          />
        </div>
      </div>

      {question.helpfulVocabulary && (
        <div className="p-4 bg-primary/5 rounded-xl">
          <p className="font-semibold mb-2">Helpful Vocabulary:</p>
          <div className="flex flex-wrap gap-2">
            {question.helpfulVocabulary.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-sm 
                  border dark:border-primary/30 border-primary/40"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  </QuestionContainer>
);

// Watch and Speak Format
const WatchAndSpeakFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  playingStatus,
  dictionary,
}) => (
  <QuestionContainer title="Watch and Speak">
    <div className="space-y-4">
      {question.videoUrl && (
        <div className="rounded-xl overflow-hidden border dark:border-primary/30 border-primary/40">
          <video src={question.videoUrl} controls className="w-full h-auto" />
        </div>
      )}

      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <InteractiveSentence
          text={question.prompt}
          dictionary={dictionary}
          onListen={onListen}
        />
        <div className="mt-4 flex gap-4">
          <ListenButton
            text={question.prompt}
            onListen={onListen}
            isPlaying={playingStatus[question.prompt]}
          />
          <SpeakButton
            onSpeak={onSpeak}
            isListening={isListening}
            isProcessing={isProcessing}
            customText="Discuss the Video"
          />
        </div>
      </div>

      {question.discussionPoints && (
        <div className="p-4 bg-primary/5 rounded-xl">
          <p className="font-semibold mb-2">Discussion Points:</p>
          <ul className="list-disc list-inside space-y-2">
            {question.discussionPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </QuestionContainer>
);

// Debate Format
const DebateFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  dictionary,
}) => (
  <QuestionContainer title="Debate Practice">
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Topic:</h3>
        <InteractiveSentence
          text={question.topic}
          dictionary={dictionary}
          onListen={onListen}
        />

        <div className="mt-4">
          <p className="font-semibold">Your Position:</p>
          <p className="text-lg">{question.position}</p>
        </div>
      </div>

      {question.keyPoints && (
        <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
          <h3 className="font-semibold mb-2">Key Points:</h3>
          <ul className="space-y-2">
            {question.keyPoints.map((point, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-sm">
                  {index + 1}
                </span>
                <span>{point}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <h3 className="font-semibold mb-2">Prepare Your Argument:</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Consider your main points</li>
          <li>Think about potential counterarguments</li>
          <li>Use persuasive language</li>
          <li>Support with examples</li>
        </ul>
        <SpeakButton
          onSpeak={onSpeak}
          isListening={isListening}
          isProcessing={isProcessing}
          customText="Present Argument"
        />
      </div>
    </div>
  </QuestionContainer>
);

// Presentation Format
const PresentationFormat = ({
  question,
  onListen,
  onSpeak,
  isListening,
  isProcessing,
  dictionary,
}) => (
  <QuestionContainer title="Presentation Practice">
    <div className="space-y-4">
      <div className="p-4 bg-primary/5 rounded-xl">
        <h3 className="text-xl font-bold mb-2">Topic:</h3>
        <p className="text-lg">{question.topic}</p>

        {question.duration && (
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
            Target Duration: {question.duration} minutes
          </p>
        )}
      </div>

      {question.structure && (
        <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
          <h3 className="font-semibold mb-4">Presentation Structure:</h3>
          <div className="space-y-4">
            {question.structure.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{section.title}</p>
                  {section.points && (
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                      {section.points.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {question.visualAids && (
        <div className="grid grid-cols-2 gap-4">
          {question.visualAids.map((aid, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="rounded-xl overflow-hidden border dark:border-primary/30 border-primary/40"
            >
              <img
                src={aid.url}
                alt={aid.description}
                className="w-full h-48 object-cover"
              />
              <p className="p-3 text-sm bg-primary/5">{aid.description}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-2xl border dark:border-primary/30 border-primary/40">
        <h3 className="font-semibold mb-4">Presentation Tips:</h3>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Start with a strong opening</li>
          <li>Use clear transitions between sections</li>
          <li>Maintain eye contact with your audience</li>
          <li>End with a memorable conclusion</li>
        </ul>
        <SpeakButton
          onSpeak={onSpeak}
          isListening={isListening}
          isProcessing={isProcessing}
          customText="Start Presentation"
        />
      </div>
    </div>
  </QuestionContainer>
);

export {
  SpeakingFormat,
  DebateFormat,
  GrammarSpeakingFormat,
  StorytellingFormat,
  ListeningFormat,
  ListenAndRepeatFormat,
  MultipleChoiceFormat,
  PresentationFormat,
  LookAndSpeakFormat,
  WatchAndSpeakFormat,
  IdiomPracticeFormat,
};
