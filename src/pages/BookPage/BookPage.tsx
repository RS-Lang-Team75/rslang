import { CardWord } from '@/components/CardWord/CardWord';
import { SideBar } from '@/components/SideBar/SideBar';
import { useWords } from '@/utils/words';

export function BookPage (){
  const { words,getWords } = useWords();

  function handleChange (value:number){
    getWords(value,0);
  };

  return(
    <main >
      <div className='flex justify-between mx-5 gap-5 md:flex-col'>

        <SideBar onChange={handleChange}/>
        <div>
          {words.map(word=> <CardWord word={word} key = {word.id}/>)}
        </div>
      </div>
    </main>

  );
}
