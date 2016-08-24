$(function() {
    /*========================================
     =            Animated Letters            =
     ========================================*/
    var animationDelay = 3000,
        lettersDelay = 100;

    function singleLetters($words) {
        $words.each(function(){
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (var i in letters) {
                letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');
        if(!$letter.is(':last-child')) {
            setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else if($bool) {
            setTimeout(function(){ hideWord(takeNext($word)); }, animationDelay);
        }
        if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');
        if(!$letter.is(':last-child')) {
            setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else {
            if(!$bool) { setTimeout(function(){ hideWord($word); }, animationDelay); }
        }
    }

    function hideWord($word) {
        var nextWord = takeNext($word);
        var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
        hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
        showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function(){
            var headline = $(this);
            setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ); }, duration);
        });
    }

    function initHeadline() {
        singleLetters($('.animated-letters').find('b'));
        animateHeadline($('.animated-letters'));
    }

    initHeadline(); 
});